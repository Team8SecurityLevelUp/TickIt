import { Request, Response, NextFunction } from 'express';
import { 
  createNewTeam,
  joinExistingTeam,
  getUserTeams,
  updateTeamStatus,
  updateTeamDetails,
  acceptJoinRequest,
  rejectJoinRequest,
  fetchTeamParticipantsService
} from '../services/teamService';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

declare global {
  namespace Express {
    interface User {
      id: number;
    }
    interface Request {
      user?: User;
    }
  }
}

// get all teams for the logged-in user
export const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user = { id: 1 }; // For local testing
    if (!req.user) throw new UnauthorizedError();

    const teams = await getUserTeams(req.user.id);

    res.status(200).json({
      status: 'success',
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new UnauthorizedError();

    const { teamId } = req.query;
    if (!teamId) {
      throw new BadRequestError('Missing teamId');
    }

    const result = await fetchTeamParticipantsService(Number(teamId));

    res.status(200).json({
      status: 'success',
      data: {
        ...result,
        currentUserId: req.user.id
      }
    });
  } catch (err) {
    next(err);
  }
};

// create a new team
export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user = { id: 4 }; // For local testing
    if (!req.user) throw new UnauthorizedError();

    const { teamName } = req.body;
    const team = await createNewTeam(teamName, req.user.id);

    res.status(201).json({
      status: 'success',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// join an existing team
export const joinTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user = { id: 1 }; // For local testing
    if (!req.user) throw new UnauthorizedError();

    const { teamId, roleType } = req.body;
    const result = await joinExistingTeam(teamId, req.user.id, roleType);

    res.status(200).json({
      status: 'success',
      message: 'Join request submitted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// respond to join request (accept or reject)
export const respondJoinRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user = { id: 2 }; // For local testing
    if (!req.user) throw new UnauthorizedError();

    const { teamId, userId, action } = req.body;
    if (!teamId || !userId || !['accept', 'reject'].includes(action)) {
      throw new BadRequestError('Invalid request data');
    }

    const handler = action === 'accept' ? acceptJoinRequest : rejectJoinRequest;
    const result = await handler(teamId, userId, req.user.id);

    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

// update team details
export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user = { id: 1 }; // For local testing
    if (!req.user) throw new UnauthorizedError();

    const teamId = parseInt(req.params.teamId);
    if (isNaN(teamId)) throw new BadRequestError('Invalid team ID');

    const { teamName } = req.body;
    const team = await updateTeamDetails(teamId, req.user.id, teamName);

    res.status(200).json({
      status: 'success',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// deactivate team
export const deactivateTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user = { id: 2 }; // For local testing
    if (!req.user) throw new UnauthorizedError();

    const teamId = parseInt(req.params.teamId);
    if (isNaN(teamId)) throw new BadRequestError('Invalid team ID');

    await updateTeamStatus(teamId, req.user.id, false);

    res.status(200).json({
      status: 'success',
      message: 'Team deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};
