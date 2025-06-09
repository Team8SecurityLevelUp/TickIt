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

const router = express.Router();

router.post('/sign-up', createUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser as express.RequestHandler);
router.post('/logout', logout);

router.get('/auth', authenticateJwt, getAuthenticatedUser);
router.get('/:userId/2fa/setup', authenticateJwt, generate2FA as express.RequestHandler);
router.post('/:userId/2fa/verify', authenticateJwt, verify2FA as express.RequestHandler);
router.post('/2fa/login', complete2FALogin as express.RequestHandler);

export default router;