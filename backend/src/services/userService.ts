import {
getUserByEmail,
insertUser,
storeVerificationToken,
getValidVerificationToken,
markTokenUsed
} from '../repositories/userRepository';
import * as bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/emailSender';

export const registerUser = async (username: string, password: string, email: string) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hash = await bcrypt.hash(password, 10); 

    const newUser = await insertUser(email, username, hash);
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await storeVerificationToken(newUser.id, token, expiresAt);
    await sendVerificationEmail(email, token);
    const userToReturn = !!newUser && {
        email:newUser.email,
        username: newUser.username,
    };
    return userToReturn;
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

