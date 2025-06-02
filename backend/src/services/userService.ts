import * as userRepo from '../repositories/userRepository';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export const registerUser = async (username: string, password: string, email: string) => {
    const existingUser = await userRepo.getUserByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    const hash = await bcrypt.hash(password, 10); 

    const twoFaSecret = null;

    const newUser = await userRepo.insertUser(email, username, hash, twoFaSecret);
    return newUser;
};
