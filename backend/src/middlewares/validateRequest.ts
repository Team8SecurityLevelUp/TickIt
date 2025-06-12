import { Request, Response, NextFunction } from 'express';

export const validateUserCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    res.status(400).json({ error: 'Email, username, and password are required.' });
  } else {
    next();
  }
};
