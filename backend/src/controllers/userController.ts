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

    const user = await authenticateUser(email, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials or email not verified' });
      return;
    }

    // TODO: Later I will replace this with a real JWT or secure cookie. IDK
    res.cookie('token', 'FAKE_TOKEN_123', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};