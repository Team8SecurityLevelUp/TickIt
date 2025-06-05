import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export const validateRequest =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};

      result.error.errors.forEach((err) => {
        const field = err.path[0]?.toString() || 'unknown';
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(err.message);
      });

      return next(new ValidationError('Validation failed', errors));
    }

    // Attach validated data to req.body
    req.body = result.data;
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
