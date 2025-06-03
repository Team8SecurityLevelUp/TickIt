import * as express from "express";
import { createUser } from "../controllers/userController";
import { validateUserCreation } from "../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/sign-up", validateUserCreation, createUser
);

export default router;