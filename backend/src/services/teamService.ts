import { 
  insertTeam,
  insertTeamMember, 
  insertTeamRole, 
  getTeamById,
  getUserTeamRoles,
  updateTeamRoleApprovalStatus,
  updateTeam as updateTeamRepo
} from '../repositories/teamRepository';
import { getRoleByName } from '../repositories/roleRepository';
import { getApprovalStatusByName } from '../repositories/approvalRepository';
import { BadRequestError, ForbiddenError } from '../utils/errors';

// Role hierarchy for effective permissions
const ROLE_HIERARCHY: Record<string, string[]> = {
  AccessAdmin: ['AccessAdmin', 'TeamLead', 'ToDoUser'],
  TeamLead: ['TeamLead', 'ToDoUser'],
  ToDoUser: ['ToDoUser'],
};

// Checks if user has a role, considering inheritance
function hasEffectiveRole(userRoles: string[], requiredRole: string): boolean {
  for (const role of userRoles) {
    if (ROLE_HIERARCHY[role]?.includes(requiredRole)) {
      return true;
    }
  }
  return false;
}

// Create a new team with default roles assigned to the creator
export const createNewTeam = async (teamName: string, userId: number) => {
  const team = await insertTeam(teamName);

  const [accessAdmin, teamLead, todoUser, accepted] = await Promise.all([
    getRoleByName('AccessAdmin'),
    getRoleByName('TeamLead'),
    getRoleByName('ToDoUser'),
    getApprovalStatusByName('Accepted')
  ]);

  if (!accessAdmin || !teamLead || !todoUser || !accepted) {
    throw new Error('Required roles or approval status not found');
  }

  // Only insert AccessAdmin role for creator
  await insertTeamRole(team.id, userId, accessAdmin.id, accepted.id);

  await insertTeamMember(team.id, userId);

  return team;
};

// Join an existing team with a role request (pending approval)
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

  // Only insert the primary role (TeamLead or ToDoUser)
  await insertTeamRole(teamId, userId, primaryRole.id, pending.id);

  return { message: 'Join request submitted for approval' };
};

// Retrieve all teams (and roles) for a user
export const getUserTeams = async (userId: number) => {
  return await getUserTeamRoles(userId);
};

// Update team active status (only AccessAdmins allowed)
export const updateTeamStatus = async (teamId: number, userId: number, isActive: boolean) => {
  const team = await getTeamById(teamId);
  if (!team) throw new BadRequestError('Team not found');

  const roles = await getUserTeamRoles(userId, teamId);
  const userRoleNames = roles.map(role => role.role_name);

  if (!hasEffectiveRole(userRoleNames, 'AccessAdmin')) {
    throw new ForbiddenError('Only Access Admins can modify team status');
  }

  return await updateTeamRepo(teamId, { is_active: isActive });
};

// Update team details (team name) allowed for AccessAdmins and TeamLeads
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

// Accept a user's join request to a team
export const acceptJoinRequest = async (teamId: number, userId: number, actingUserId: number) => {
  // Check if acting user is AccessAdmin for this team
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

// Reject a user's join request to a team
export const rejectJoinRequest = async (teamId: number, userId: number, actingUserId: number) => {
  // Check if acting user is AccessAdmin for this team
  const adminRoles = await getUserTeamRoles(actingUserId, teamId);
  const adminRoleNames = adminRoles.map(role => role.role_name);
  if (!hasEffectiveRole(adminRoleNames, 'AccessAdmin')) {
    throw new ForbiddenError('Only Access Admins can reject join requests');
  }

  const roles = await getUserTeamRoles(userId, teamId);
  if (!roles.length) throw new BadRequestError('No join request found');

  const pendingRoles = roles.filter(r => r.approval_status === 'Pending');
  if (!pendingRoles.length) throw new BadRequestError('No pending join requests');

  const rejected = await getApprovalStatusByName('Rejected');
  if (!rejected) throw new Error('Rejected status missing');

  await updateTeamRoleApprovalStatus(teamId, userId, rejected.id);

  return { message: 'Join request rejected' };
};
