import db from '../config/database';
import { DatabaseError } from '../utils/errors';

export const getApprovalStatusByName = async (status: string) => {
  try {
    const result = await db.query(
      `SELECT id, status
       FROM approval_statuses
       WHERE status = $1`,
      [status]
    );
    return result.rows[0];
  } catch (error) {
    throw new DatabaseError(`Failed to get approval status: ${(error as Error).message}`);
  }
};