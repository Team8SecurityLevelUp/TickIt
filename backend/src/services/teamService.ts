import { 
  insertTeam,
  insertTeamMember, 
  insertTeamRole, 
  getTeamById,
  getUserTeamRoles,
  updateTeamRoleApprovalStatus,
  updateTeam as updateTeamRepo,
  getTeamsWithUserRoles,
  fetchTeamParticipants,
  countUserCreatedTeams
} from '../repositories/teamRepository';
import { getRoleByName } from '../repositories/roleRepository';
import { updateTeamRole } from '../repositories/teamRepository'; 
import { getApprovalStatusByName } from '../repositories/approvalRepository';
import { BadRequestError, ForbiddenError } from '../utils/errors';


const ROLE_HIERARCHY: Record<string, string[]> = {
  Creator: ['Creator', 'AccessAdmin', 'TeamLead', 'ToDoUser'],
  AccessAdmin: ['AccessAdmin', 'TeamLead', 'ToDoUser'],
  TeamLead: ['TeamLead', 'ToDoUser'],
  ToDoUser: ['ToDoUser'],
};

function hasEffectiveRole(userRoles: string[], requiredRole: string): boolean {
  for (const role of userRoles) {
    if (ROLE_HIERARCHY[role]?.includes(requiredRole)) {
      return true;
    }
  }
  return false;
}

const TEAM_CREATION_LIMIT = 10;


export const createNewTeam = async (teamName: string, userId: number) => {
  
  const teamCount = await countUserCreatedTeams(userId);
  if (teamCount >= TEAM_CREATION_LIMIT) {
    throw new BadRequestError(`You have reached the maximum limit of ${TEAM_CREATION_LIMIT} teams`);
  }

  const team = await insertTeam(teamName);

  const [creator, accessAdmin, teamLead, todoUser, accepted] = await Promise.all([
    getRoleByName('Creator'),
    getRoleByName('AccessAdmin'),
    getRoleByName('TeamLead'),
    getRoleByName('ToDoUser'),
    getApprovalStatusByName('Accepted')
  ]);

  if (!creator || !accessAdmin || !teamLead || !todoUser || !accepted) {
    throw new Error('Required roles or approval status not found');
  }

  await Promise.all([
    insertTeamRole(team.id, userId, creator.id, accepted.id),
    insertTeamRole(team.id, userId, accessAdmin.id, accepted.id),
    insertTeamRole(team.id, userId, teamLead.id, accepted.id),
    insertTeamRole(team.id, userId, todoUser.id, accepted.id)
  ]);

  await insertTeamMember(team.id, userId);

  return team;
};

export const joinExistingTeam = async (
  teamId: number,
  userId: number,
  roleType: 'TeamLead' | 'ToDoUser'
) => {
  const team = await getTeamById(teamId);
  if (!team) throw new BadRequestError('Team not found');
  if (!team.is_active) throw new BadRequestError('Team is not active');

  const existingRoles = await getUserTeamRoles(userId, teamId);
  if (existingRoles.length > 0) {
    throw new BadRequestError('User already has roles in this team');
  }

  const [primaryRole, todoUser, pending] = await Promise.all([
    getRoleByName(roleType),
    getRoleByName('ToDoUser'),
    getApprovalStatusByName('Pending')
  ]);

  if (!primaryRole || !todoUser || !pending) {
    throw new Error('Required roles or status not found');
  }


  await insertTeamRole(teamId, userId, primaryRole.id, pending.id);

  return { message: 'Join request submitted for approval' };
};

export const getUserTeams = async (userId: number) => {
  return await getTeamsWithUserRoles(userId);
};


export const updateTeamStatus = async (teamId: number, userId: number, isActive: boolean) => {
  const team = await getTeamById(teamId);
  if (!team) throw new BadRequestError('Team not found');

  const roles = await getUserTeamRoles(userId, teamId);
  const userRoleNames = roles.map(role => role.role_name);

  if (!hasEffectiveRole(userRoleNames, 'Creator')) {
    throw new ForbiddenError('Only the creator can modify team status');
  }

  return await updateTeamRepo(teamId, { is_active: isActive });
};


export const updateTeamDetails = async (teamId: number, userId: number, teamName: string) => {
  const team = await getTeamById(teamId);
  if (!team) throw new BadRequestError('Team not found');

  const roles = await getUserTeamRoles(userId, teamId);
  const userRoleNames = roles.map(role => role.role_name);

  const allowed =
    hasEffectiveRole(userRoleNames, 'AccessAdmin') ||
    hasEffectiveRole(userRoleNames, 'TeamLead');
  if (!allowed) throw new ForbiddenError('Only Access Admins and Team Leads can modify team details');

  return await updateTeamRepo(teamId, { team_name: teamName });
};


export const acceptJoinRequest = async (teamId: number, userId: number, actingUserId: number) => {

  const adminRoles = await getUserTeamRoles(actingUserId, teamId);
  const adminRoleNames = adminRoles.map(role => role.role_name);
  if (!hasEffectiveRole(adminRoleNames, 'AccessAdmin')) {
    throw new ForbiddenError('Only Access Admins can approve join requests');
  }

  const roles = await getUserTeamRoles(userId, teamId);
  if (!roles.length) throw new BadRequestError('No join request found');

  const pendingRoles = roles.filter(r => r.approval_status === 'Pending');
  if (!pendingRoles.length) throw new BadRequestError('No pending join requests');

  const accepted = await getApprovalStatusByName('Accepted');
  if (!accepted) throw new Error('Accepted status missing');

  await insertTeamMember(teamId, userId);
  await updateTeamRoleApprovalStatus(teamId, userId, accepted.id);

  return { message: 'Join request accepted and user added to team members' };
};


export const rejectJoinRequest = async (teamId: number, userId: number, actingUserId: number) => {
  const adminRoles = await getUserTeamRoles(actingUserId, teamId);
  const adminRoleNames = adminRoles.map(role => role.role_name);
  if (!hasEffectiveRole(adminRoleNames, 'AccessAdmin')) {
    throw new ForbiddenError('Only Access Admins can reject join requests');
  }

  const roles = await getUserTeamRoles(userId, teamId);
  if (!roles.length) throw new BadRequestError('No join request found');

  const pendingRoles = roles.filter(r => r.approval_status === 'Pending');
  if (!pendingRoles.length) throw new BadRequestError('No pending join requests');

  const rejected = await getApprovalStatusByName('Declined');
  if (!rejected) throw new Error('Rejected status missing');

  await updateTeamRoleApprovalStatus(teamId, userId, rejected.id);

  return { message: 'Join request rejected' };
};

export const fetchTeamParticipantsService = async (teamId: number) => {
  const raw = await fetchTeamParticipants(teamId);

  const memberMap: Record<number, { user_id: number; username: string; roles: string[] }> = {};
  const joinRequests: { user_id: number; username: string }[] = [];

  for (const row of raw) {
    if (row.approval_status === 'Accepted') {
      if (!memberMap[row.user_id]) {
        memberMap[row.user_id] = {
          user_id: row.user_id,
          username: row.username,
          roles: []
        };
      }
      memberMap[row.user_id].roles.push(row.role_name);
    } else if (row.approval_status === 'Pending') {
      if (!joinRequests.some(jr => jr.user_id === row.user_id)) {
        joinRequests.push({
          user_id: row.user_id,
          username: row.username
        });
      }
    }
  }

  const members = Object.values(memberMap);
  return { members, joinRequests };
};


export const updateUserRoleOnTeam = async (
  teamId: number,
  targetUserId: number,
  newRoleName: string,
  actingUserId: number
) => {
  const roles = await getUserTeamRoles(actingUserId, teamId);
  const userRoleNames = roles.map(role => role.role_name);
  if (!hasEffectiveRole(userRoleNames, 'AccessAdmin')) {
    throw new ForbiddenError('Only Access Admins can update roles');
  }

  const newRole = await getRoleByName(newRoleName);
  if (!newRole) throw new BadRequestError('Role not found');

  return await updateTeamRole(teamId, targetUserId, newRole.id);
};


