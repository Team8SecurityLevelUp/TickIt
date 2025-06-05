import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { 
    createTask, 
    updateTaskStatus, 
    assignTask, 
    updateTaskDetails,
    updateTaskCompletion,
    deleteTask,
    getTaskStatusHistory,
    getAllTasks,
    getTaskById 
} from '../controllers/taskController';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => getAllTasks(req, res, next));
router.get('/:taskId', (req: Request, res: Response, next: NextFunction) => getTaskById(req, res, next));
router.post('/', (req: Request, res: Response, next: NextFunction) => createTask(req, res, next));
router.patch('/:taskId/status', (req: Request, res: Response, next: NextFunction) => updateTaskStatus(req, res, next));
router.patch('/:taskId/assign', (req: Request, res: Response, next: NextFunction) => assignTask(req, res, next));
router.patch('/:taskId', (req: Request, res: Response, next: NextFunction) => updateTaskDetails(req, res, next));
router.patch('/:taskId/complete', (req: Request, res: Response, next: NextFunction) => updateTaskCompletion(req, res, next));
router.delete('/:taskId', (req: Request, res: Response, next: NextFunction) => deleteTask(req, res, next));
router.get('/:taskId/history', (req: Request, res: Response, next: NextFunction) => getTaskStatusHistory(req, res, next));

export default router;