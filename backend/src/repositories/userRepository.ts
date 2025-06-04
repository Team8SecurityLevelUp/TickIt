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

export const updateUnverifiedUser = async (email: string, username: string, hash: string) => {
  const result = await db.query(
    `
    UPDATE users 
    SET username = $1, password_hash = $2
    WHERE email = $3
    RETURNING id, email, username
    `,
    [username, hash, email]
  );
  return result.rows[0];
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

export const getVerifiedUserByEmail = async (email: string) => {
  const result = await db.query(
    `SELECT u.password_hash, u.email, u.username
     FROM users u
     JOIN user_verification uv ON uv.user_id = u.id
     WHERE u.email = $1
       AND uv.is_used = true
     LIMIT 1`,
    [email]
  );
  return result.rows[0];
};

export const getUnverifiedUserWithPendingToken = async (email: string) => {
  const result = await db.query(
    `
    SELECT u.id, u.email, u.username
    FROM users u
    WHERE u.email = $1
      AND NOT EXISTS (
        SELECT 1
        FROM user_verification v
        WHERE v.user_id = u.id
          AND v.is_used = false
          AND v.expiration_date < NOW()
      )
    `,
    [email]
  );
  return result.rows[0];
};

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

export const hasUsedVerificationToken = async (userId: number) => {
  const result = await db.query(
    `SELECT 1 FROM user_verification WHERE user_id = $1 AND is_used = true LIMIT 1`,
    [userId]
  );
  return (result.rowCount ?? 0) > 0;
};
