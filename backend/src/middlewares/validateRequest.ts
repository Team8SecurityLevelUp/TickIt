import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export const validateRequest =
  (validator?: (body: any) => { valid: boolean; errors?: Record<string, string[]> }) =>
    (req: Request, res: Response, next: NextFunction) => {
      if (!validator) {
        return next();
      }
      const result = validator(req.body);

      if (!result.valid) {
        return next(new ValidationError('Validation failed', result.errors || {}));
      }

      next();
    };

export const validateUserCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    res.status(400).json({ error: 'Email, username, and password are required.' });
  } else {
    next();
  }
};
