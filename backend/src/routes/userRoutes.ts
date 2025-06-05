import express from "express";
import { createUser, loginUser, verifyEmail, getAuthenticatedUser } from "../controllers/userController";
import { validateUserCreation } from "../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/sign-up", validateUserCreation, createUser
);

router.get(
  '/verify-email', verifyEmail
);

router.post(
  '/login', loginUser
);

router.get('/auth', getAuthenticatedUser);

export default router;