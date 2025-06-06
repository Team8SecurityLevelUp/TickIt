import db from '../config/database';
import { DatabaseError } from '../utils/errors';

export const getRoleByName = async (roleName: string) => {
  try {
    const result = await db.query(
      `SELECT id, role_name
       FROM roles
       WHERE role_name = $1`,
      [roleName]
    );
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to get role: ${(error as Error).message}`);
  }
};