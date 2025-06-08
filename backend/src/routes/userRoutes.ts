import express from "express";

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

import { validateUserCreation } from "../middlewares/validateRequest";

const router = express.Router();

router.post('/sign-up', validateUserCreation, createUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);


router.post(
  '/logout', logout
)


router.get('/auth', getAuthenticatedUser);

router.get('/2fa/setup', generate2FA);
router.post('/2fa/verify', verify2FA);
router.post('/2fa/login', complete2FALogin);

export default router;