import express from "express";
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

router.use(authenticateJwt({ skip2FA: false }));

router.get("/", getTeams);

router.get("/team-members", getTeamParticipants);

router.put("/update-role", updateUserRole);

router.post("/create", createTeam);

router.post("/join", joinTeam);

router.post("/respond", respondJoinRequest);

router.put("/:teamId/deactivate", deactivateTeam);


router.put("/:teamId", updateTeam);

export default router;
