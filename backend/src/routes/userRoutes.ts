import express from "express";
import { validateRequest } from '../middlewares/validateRequest';
import { userCreationSchema, loginSchema } from '../schemas/userSchemas';
import { createUser, loginUser, verifyEmail, getAuthenticatedUser } from "../controllers/userController";

const router = express.Router();

router.post(
  "/sign-up",
  validateRequest(userCreationSchema),
  createUser
);

router.get('/verify-email', verifyEmail);

router.post(
  '/login',
  validateRequest(loginSchema),
  loginUser
);

router.get('/auth', getAuthenticatedUser);

export default router;
