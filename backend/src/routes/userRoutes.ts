import express from "express";
import { createUser, loginUser, verifyEmail } from "../controllers/userController";
import { validateUserCreation } from "../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/sign-up", validateUserCreation, createUser
);

router.post(
  '/verify-email', verifyEmail
);

router.post(
  '/login', loginUser
);

export default router;