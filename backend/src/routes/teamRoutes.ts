import express from "express";
import { validateRequest } from '../middlewares/validateRequest';
import { teamCreationSchema, teamJoinSchema } from '../schemas/teamSchemas';
import { 
  createTeam, 
  joinTeam, 
  getTeams,
  deactivateTeam, 
  updateTeam,
  respondJoinRequest,
  getTeamParticipants,
  updateUserRole
} from "../controllers/teamController";
import { authenticateJwt } from '../middlewares/auth';

const router = express.Router();

router.use(authenticateJwt); // Comment this line to disable JWT authentication for team all routes

router.get("/", getTeams);

router.get("/team-members", getTeamParticipants);

router.post("/create", validateRequest(teamCreationSchema), createTeam);

router.post("/join", validateRequest(teamJoinSchema), joinTeam);

router.post("/respond", respondJoinRequest);

router.put("/:teamId/deactivate", deactivateTeam);

router.put("/:teamId", validateRequest(teamCreationSchema), updateTeam);

router.put("/update-role", updateUserRole);

export default router;
