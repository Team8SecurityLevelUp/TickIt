import * as userRepo from '../repositories/userRepository';
import * as bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../utils/emailSender';

export const registerUser = async (username: string, password: string, email: string) => {
    const existingUser = await userRepo.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hash = await bcrypt.hash(password, 10); 

    const newUser = await userRepo.insertUser(email, username, hash);
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await userRepo.storeVerificationToken(newUser.id, token, expiresAt);
    await sendVerificationEmail(email, token);
    const userToReturn = !!newUser && {
        email:newUser.email,
        username: newUser.username,
    };
    return userToReturn;
};
