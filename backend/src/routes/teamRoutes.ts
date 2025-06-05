import express from "express";
import { validateRequest } from '../middlewares/validateRequest';
import { teamCreationSchema, teamJoinSchema } from '../schemas/teamSchemas';
import { 
  createTeam, 
  joinTeam, 
  getTeams, 
  deactivateTeam, 
  updateTeam,
  respondJoinRequest 
} from "../controllers/teamController";
import { authenticateJwt } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateJwt);

router.get("/", getTeams);

router.post("/create", validateRequest(teamCreationSchema), createTeam);

router.post("/join", validateRequest(teamJoinSchema), joinTeam);

router.post("/respond", respondJoinRequest);

router.put("/:teamId/deactivate", deactivateTeam);

router.put("/:teamId", validateRequest(teamCreationSchema), updateTeam);

export default router;
