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

export const getValidVerificationToken = async (userId: number, token: string) => {
  const result = await db.query(
    `SELECT id FROM user_verification
     WHERE user_id = $1 AND token = $2 AND is_used = false AND expiration_date > NOW()`,
    [userId, token]
  );
  return result.rows[0];
};

export const markTokenUsed = async (id: number) => {
  await db.query(
    `UPDATE user_verification SET is_used = true WHERE id = $1`,
    [id]
  );
};