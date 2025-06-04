import express from "express";
import { createUser, verifyEmail } from "../controllers/userController";
import { validateUserCreation } from "../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/sign-up", validateUserCreation, createUser
);

router.post(
  '/verify-email', verifyEmail
);

export default router;