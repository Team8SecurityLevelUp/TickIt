import express from "express";
import { authenticateJwt } from '../middlewares/auth';
import { 
  createUser, 
  loginUser, 
  verifyEmail, 
  getAuthenticatedUser, 
  generate2FA,
  verify2FA,
  complete2FALogin,
  logout
} from "../controllers/userController";

import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many login/sign-up attempts. Please try again later.'
  }
});

const router = express.Router();

router.post('/sign-up', authLimiter, createUser);
router.get('/verify-email', verifyEmail);
router.post('/login', authLimiter, loginUser as express.RequestHandler);
router.post('/logout', logout);

router.get('/auth', authenticateJwt({ skip2FA: false }), getAuthenticatedUser);
router.get('/2fa/setup', authenticateJwt({ skip2FA: true }), generate2FA as express.RequestHandler);
router.post('/2fa/verify', authenticateJwt({ skip2FA: true }), verify2FA as express.RequestHandler);
router.post('/2fa/login', complete2FALogin as express.RequestHandler);

export default router;