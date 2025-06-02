import db from '../config/database';

export const insertUser = async (email: string, username: string, hash: string, twoFaSecret: string | null) => {
  const result = await db.query(
    `INSERT INTO users (email, username, password_hash, two_fa_secret)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, username`,
    [email, username, hash, twoFaSecret]
  );
  return result.rows[0];
};


export const getUserByEmail = async (email: string) => {
  const result = await db.query(
    `SELECT id, email, username, password_hash, salt, two_fa_secret
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}