import { Request, Response, NextFunction } from 'express';
import { registerUser, verifyEmailToken, authenticateUser } from '../services/userService';

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
    const emailParam = req.query.email;
    const tokenParam = req.query.token;

    if (typeof emailParam !== 'string' || typeof tokenParam !== 'string') {
      res.status(400).json({ message: 'Email and token must be strings' });
      return;
    }
    const email = emailParam;
    const token = tokenParam;

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

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const result = await authenticateUser(email, password);
    if (!result) {
      res.status(401).json({ message: 'Invalid credentials or email not verified' });
      return;
    }

    const { token, user } = result;

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};