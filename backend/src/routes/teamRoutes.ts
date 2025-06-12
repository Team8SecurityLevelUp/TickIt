import express from "express";
import { validateRequest } from '../middlewares/validateRequest';
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
router.post("/create", validateRequest(), createTeam);

router.post("/join", validateRequest(), joinTeam);

router.post("/respond", respondJoinRequest);

router.put("/:teamId/deactivate", deactivateTeam);


router.put("/:teamId", validateRequest(), updateTeam);

export default router;
