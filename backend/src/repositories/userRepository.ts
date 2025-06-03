import db from '../config/database';

export const insertUser = async (email: string, username: string, hash: string) => {
  const result = await db.query(
    `INSERT INTO users (email, username, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, username`,
    [email, username, hash]
  );
  return result?.rows[0];
};


export const getUserByEmail = async (email: string) => {
  const result = await db.query(
    `SELECT id, email, username, password_hash, two_factor_authentication_secret
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

export const storeVerificationToken = async (
  userId: number,
  token: string,
  expiration: Date
) => {
  await db.query(
    `INSERT INTO user_verification (user_id, token, expiration_date)
     VALUES ($1, $2, $3)`,
    [userId, token, expiration]
  );
};