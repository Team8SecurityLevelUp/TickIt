import {
getUserByEmail,
insertUser,
storeVerificationToken,
getValidVerificationToken,
markTokenUsed,
getVerifiedUserByEmail,
getUnverifiedUserWithPendingToken,
updateUnverifiedUser
} from '../repositories/userRepository';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/emailSender';

export const registerUser = async (username: string, password: string, email: string) => {
    const user = await getUserByEmail(email);
    let updateUser = false;
    if(user){
        const existingUser = await getVerifiedUserByEmail(email);
        if (existingUser) {
            return null;
        }
        const existingUnverifiedUserInPendingState = await getUnverifiedUserWithPendingToken(email);
        if (existingUnverifiedUserInPendingState) {
            return null;
        }
        updateUser = true;
    }

    const hash = await bcrypt.hash(password, 10); 

    let newUser;
    if (updateUser) {
        newUser = await updateUnverifiedUser(email, username, hash);
    } else {
        newUser = await insertUser(email, username, hash);
    }
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await storeVerificationToken(newUser.id, token, expiresAt);
    await sendVerificationEmail(email, token);
    return {
        email: newUser.email,
        username: newUser.username,
    };
};

export const verifyEmailToken = async (email: string, token: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  if (!user) {
    return false;
  }

  const record = await getValidVerificationToken(user.id, token);
  if (!record) {
    return false;   
  }

  await markTokenUsed(record.id);
  return true;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await getVerifiedUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  const payload = {
    email: user.email,
    username: user.username,
    sub: user.id,
  };

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment variables');
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return { 
    token, 
    user: { 
      email: user.email, 
      username: user.username,
      two_factor_authentication_secret: user.two_factor_authentication_secret 
    } 
  };
};