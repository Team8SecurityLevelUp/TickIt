import db from '../config/database';
import { DatabaseError } from '../utils/errors';

export const insertTeam = async (teamName: string) => {
  try {
    const result = await db.query(
      `INSERT INTO teams (team_name, is_active)
       VALUES ($1, true)
       RETURNING id, team_name, is_active, date_created`,
      [teamName]
    );
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to create team: ${(error as Error).message}`);
  }
};

export const insertTeamRole = async (
  teamId: number,
  userId: number,
  roleId: number,
  approvalStatusId: number
) => {
  try {
    const result = await db.query(
      `INSERT INTO team_roles (team_id, user_id, role_id, approved_status_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [teamId, userId, roleId, approvalStatusId]
    );
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to assign role: ${(error as Error).message}`);
  }
};

export const getTeamById = async (teamId: number) => {
  try {
    const result = await db.query(
      `SELECT id, team_name, is_active, date_created
       FROM teams
       WHERE id = $1`,
      [teamId]
    );
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to get team: ${(error as Error).message}`);
  }
};

export const fetchTeamParticipants = async (teamId: number) => {
  const query = `
    SELECT 
      u.id AS user_id,
      u.username,
      r.role_name,
      a.status AS approval_status
    FROM team_roles tr
    JOIN users u ON u.id = tr.user_id
    JOIN roles r ON r.id = tr.role_id
    JOIN approval_statuses a ON a.id = tr.approved_status_id
    WHERE tr.team_id = $1
    ORDER BY u.username ASC
  `;
  const result = await db.query(query, [teamId]);
  return result.rows;
};




export const getUserTeamRoles = async (userId: number, teamId?: number) => {
  try {
    let query = `
      SELECT t.id as team_id, t.team_name, t.is_active,
             r.role_name, tr.approved_status_id,
             ast.status as approval_status
      FROM teams t
      JOIN team_roles tr ON tr.team_id = t.id
      JOIN roles r ON r.id = tr.role_id
      JOIN approval_statuses ast ON ast.id = tr.approved_status_id
      WHERE tr.user_id = $1
    `;

    const values = [userId];

    if (teamId !== undefined) {
      query += ` AND t.id = $2`;
      values.push(teamId);
    }

    query += ` ORDER BY t.date_created DESC`;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      console.warn(`No roles found for user ${userId}${teamId ? ` in team ${teamId}` : ''}`);
    }

    return result.rows;
  } catch (error) {
    throw new DatabaseError(`Failed to get user team roles: ${(error as Error).message}`);
  }
};

export const getTeamsWithUserRoles = async (userId: number, teamId?: number) => {
  try {
    let query = `
      SELECT 
        t.id AS team_id,
        t.team_name,
        t.is_active,
        r.role_name,
        ast.status AS approval_status,
        u.username AS creator_username,
        (
          SELECT COUNT(*) 
          FROM team_members tm 
          WHERE tm.team_id = t.id
        )::int AS member_count
      FROM teams t
      LEFT JOIN team_roles tr ON tr.team_id = t.id AND tr.user_id = $1
      LEFT JOIN roles r ON r.id = tr.role_id
      LEFT JOIN approval_statuses ast ON ast.id = tr.approved_status_id
      JOIN team_roles creator_tr ON creator_tr.team_id = t.id
      JOIN roles creator_r ON creator_r.id = creator_tr.role_id AND creator_r.role_name = 'Creator'
      JOIN users u ON u.id = creator_tr.user_id
    `;

    const values: (number | undefined)[] = [userId];

    if (teamId !== undefined) {
      query += ` WHERE t.id = $2`;
      values.push(teamId);
    }

    query += ` ORDER BY t.date_created DESC`;

    const result = await db.query(query, values);

    const teamMap: Record<number, any> = {};

    for (const row of result.rows) {
      const teamId = row.team_id;
      if (!teamMap[teamId]) {
        teamMap[teamId] = {
          team_id: row.team_id,
          team_name: row.team_name,
          is_active: row.is_active,
          member_count: row.member_count,
          roles: [],
          creator: {
            username: row.creator_username
          }
        };
      }

      if (row.role_name) {
        teamMap[teamId].roles.push({
          role_name: row.role_name,
          approval_status: row.approval_status
        });
      }
    }

    return Object.values(teamMap);
  } catch (error) {
    throw new DatabaseError(`Failed to get user team roles`);
  }
};

export const updateTeam = async (
  teamId: number,
  updates: { team_name?: string; is_active?: boolean }
) => {
  try {
    const setClauses: string[] = [];
    const values: (string | boolean | number)[] = [teamId];
    let paramCount = 2;

    if (updates.team_name !== undefined) {
      setClauses.push(`team_name = $${paramCount}`);
      values.push(updates.team_name);
      paramCount++;
    }

    if (updates.is_active !== undefined) {
      setClauses.push(`is_active = $${paramCount}`);
      values.push(updates.is_active ? '1' : '0');
      paramCount++;
    }

    if (setClauses.length === 0) {
      throw new DatabaseError('No fields provided for update');
    }

    const query = `
      UPDATE teams
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING id, team_name, is_active, date_created`;

    const result = await db.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to update team: ${(error as Error).message}`);
  }
};

export const insertTeamMember = async (teamId: number, userId: number) => {
  try {
    const existing = await db.query(
      `SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2`,
      [teamId, userId]
    );
    if (existing.rows.length > 0) return existing.rows[0]; // already a member

    const result = await db.query(
      `INSERT INTO team_members (team_id, user_id) VALUES ($1, $2) RETURNING id`,
      [teamId, userId]
    );
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to add team member: ${(error as Error).message}`);
  }
};

export const updateTeamRoleApprovalStatus = async (
  teamId: number,
  userId: number,
  approvalStatusId: number
) => {
  try {
    const result = await db.query(
      `UPDATE team_roles
       SET approved_status_id = $3
       WHERE team_id = $1 AND user_id = $2
         AND approved_status_id = (SELECT id FROM approval_statuses WHERE status = 'Pending')
       RETURNING id`,
      [teamId, userId, approvalStatusId]
    );
    return result.rows;
  } catch (error) {
    throw new DatabaseError(`Failed to update approval status: ${(error as Error).message}`);
  }
};
