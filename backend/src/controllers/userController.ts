import { Request, Response, NextFunction } from 'express';
import { registerUser, verifyEmailToken } from '../services/userService';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, email } = req.body;
        const user = await registerUser(username, password, email);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      res.status(400).json({ message: 'Email and token are required' });
      return;
    }

    const result = await verifyEmailToken(email, token);

    if (!result) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};