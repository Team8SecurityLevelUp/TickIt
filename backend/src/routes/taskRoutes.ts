import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createTask } from '../controllers/taskController';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => createTask(req, res, next));

export default router;