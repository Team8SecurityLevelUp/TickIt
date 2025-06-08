import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/Users';
import { registerUser, verifyEmailToken, authenticateUser } from '../services/userService';
import { getVerifiedUserByEmail } from '../repositories/userRepository';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { Session } from 'express-session';
import { update2FASecret } from '../repositories/userRepository';

// Mock user for testing
const TEST_USER = {
  id: 4,
  email: "12345@gmail.com",
  username: "Testers"
};

interface RequestWithSession extends Request {
  session: Session & {
    twoFactorSecret?: string;
    loginToken?: string;
  };
}

interface AuthResponse {
  user: {
    email: string;
    username: string;
    two_factor_authentication_secret?: string;
  };
  token: string;
}

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

export const loginUser = async (
  req: RequestWithSession, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const result = await authenticateUser(email, password) as AuthResponse | null;
    if (!result) {
      res.status(401).json({ message: 'Invalid credentials or email not verified' });
      return;
    }

    const { token, user } = result;

    // Store token in session instead of sending it to client
    req.session.loginToken = token;
    await req.session.save();

    // Only send user info and 2FA requirement status
    res.status(200).json({ 
      user: {
        email: user.email,
        username: user.username
      },
      requires2FA: !!user.two_factor_authentication_secret
    });
  } catch (err) {
    next(err);
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Mock response for testing
    res.status(200).json({
      user: TEST_USER
    });
  } catch (err) {
    next(err);
  }
};

export const generate2FA = async (
  req: RequestWithSession, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    req.user = TEST_USER;
    
    // Check if we already have a secret in the session
    if (req.session.twoFactorSecret) {
      // Recreate QR code from existing secret
      const existingSecret = {
        otpauth_url: `otpauth://totp/TickIt%20(${TEST_USER.username})?secret=${req.session.twoFactorSecret}`,
        base32: req.session.twoFactorSecret
      };
      
      const qrCode = await qrcode.toDataURL(existingSecret.otpauth_url);
      
      res.status(200).json({
        qrCode,
        message: 'Scan this QR code with your authenticator app'
      });
      return;
    }
    
    // Generate new secret only if one doesn't exist
    const secret = speakeasy.generateSecret({
      name: `TickIt (${TEST_USER.username})`,
    });

    // Store in session
    req.session.twoFactorSecret = secret.base32;
    await req.session.save();

    const qrCode = await qrcode.toDataURL(secret.otpauth_url!);

    res.status(200).json({
      qrCode,
      message: 'Scan this QR code with your authenticator app'
    });
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (
  req: RequestWithSession, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.body;

    // Validate token format
    if (!token || typeof token !== 'string') {
      res.status(400).json({ message: 'Token is required' });
      return;
    }

    // Remove any spaces and validate format
    const cleanToken = token.replace(/\s/g, '');
    if (!/^\d{6}$/.test(cleanToken)) {
      res.status(400).json({ message: 'Token must be 6 digits' });
      return;
    }

    req.user = TEST_USER;

    const secret = req.session.twoFactorSecret;
    if (!secret) {
      res.status(400).json({ message: 'Please complete 2FA setup first' });
      return;
    }

    const isVerified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: cleanToken,
      window: 1,
    });

    if (isVerified) {
      await update2FASecret(TEST_USER.id, secret);
      delete req.session.twoFactorSecret;
      await req.session.save();

      res.status(200).json({ message: '2FA setup successful' });
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
};

export const complete2FALogin = async (
  req: RequestWithSession, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { otp } = req.body;
    // For testing, use TEST_USER instead of token verification
    const user = {
      email: TEST_USER.email,
      username: TEST_USER.username,
      two_factor_authentication_secret: req.session.twoFactorSecret // Use session secret for testing
    };

    if (!user.two_factor_authentication_secret) {
      res.status(400).json({ message: 'Please complete 2FA setup first' });
      return;
    }

    const isValid = speakeasy.totp.verify({
      secret: user.two_factor_authentication_secret,
      encoding: 'base32',
      token: otp,
      window: 1,
    });

    if (!isValid) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    // Set test token
    const token = 'test-token-123';

    // Set the cookie for testing
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // Set to false for testing
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({ 
      message: '2FA verification successful',
      user: {
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
};
