import { Router } from 'express';
import { authenticateJwt } from '../middlewares/auth';

import { 
    createTask, 
    updateTaskStatus, 
    assignTask, 
    updateTaskDetails,
    updateTaskCompletion,
    deleteTask,
    getTaskStatusHistory,
    getAllTasks,
    getTaskById,
    getAllTeamTasks,
} from '../controllers/taskController';

const router = Router();

router.use(authenticateJwt({ skip2FA: false }));

router.get('/', getAllTasks);
router.get('/:teamId', getAllTeamTasks);
router.get('/:taskId', getTaskById);
router.post('/', createTask);
router.patch('/:taskId/status', updateTaskStatus);
router.patch('/:taskId/assign', assignTask);
router.patch('/:taskId', updateTaskDetails);
router.patch('/:taskId/complete', updateTaskCompletion);
router.delete('/:taskId', deleteTask);
router.get('/:taskId/history', getTaskStatusHistory);

export default router;
