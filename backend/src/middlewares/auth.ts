import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: number;
  email?: string;
  username?: string;
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction): void => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : undefined);

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('Missing JWT_SECRET in environment variables');
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'sub' in decoded &&
      decoded.sub !== undefined &&
      'email' in decoded &&
      'username' in decoded
    ) {
      req.user = {
        id: typeof decoded.sub === 'string' ? parseInt(decoded.sub, 10) : decoded.sub,
        email: decoded.email,
        username: decoded.username
      };
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
    return;
  }
};
