import type { Request, Response, NextFunction } from 'express';
import taskRepository from '../repositories/taskRepository';
import { UnauthorizedError } from '../utils/errors';

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new UnauthorizedError();
        const createdByUserId = req.user.id;
        const {
            teamId,
            title,
            description,
            dueDate
        } = req.body;

        if (!teamId || !title || !createdByUserId || !dueDate) {
            res.status(400).json({
                error: 'Required fields missing: teamId, title, createdByUserId, and dueDate are required'
            });
            return;
        }

        try {
            const task = await taskRepository.insertTask(
                teamId,
                title,
                description || '',
                1,
                createdByUserId,
                null,
                new Date(),
                new Date(dueDate),
                null
            );
            res.status(201).json(task);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Team not found') {
                    res.status(404).json({ error: 'Team not found' });
                    return;
                }
                if (error.message === 'Cannot create task: Team is not active') {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new UnauthorizedError();
        const userId = req.user.id;
        const taskId = parseInt(req.params.taskId);
        const { statusId } = req.body;

        if (!statusId || !userId) {
            res.status(400).json({
                error: 'Required fields missing: taskId, statusId, and userId are required'
            });
            return;
        }

        const task = await taskRepository.updateTaskStatus(
            taskId,
            statusId,
            userId
        );

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

export const assignTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user) throw new UnauthorizedError();
        const userId = req.user.id;
        const taskId = parseInt(req.params.taskId);
        const { assignedUserId } = req.body;

        if (isNaN(taskId)) {
            res.status(400).json({
                error: 'Invalid task ID'
            });
            return;
        }
        if (!userId) {
            res.status(400).json({
                error: 'Acting userId is required'
            });
            return;
        }

        const task = await taskRepository.assignTask(
            taskId,
            assignedUserId || null,
            userId 
        );

        res.status(200).json(task);
    } catch (error) {
        if (error instanceof Error && error.message === 'Task not found') {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        next(error);
    }
};

export const updateTaskDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = parseInt(req.params.taskId);
        const { title, description, dueDate } = req.body;

        if (isNaN(taskId)) {
            res.status(400).json({
                error: 'Invalid task ID'
            });
            return;
        }

        if (!title) {
            res.status(400).json({
                error: 'Title is required'
            });
            return;
        }

        const task = await taskRepository.updateTaskDetails(
            taskId,
            title,
            description || '',
            dueDate ? new Date(dueDate) : null
        );

        res.status(200).json(task);
    } catch (error) {
        if (error instanceof Error && error.message === 'Task not found') {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        next(error);
    }
};

export const updateTaskCompletion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = parseInt(req.params.taskId);
        const { completed, completed_at } = req.body;

        if (isNaN(taskId)) {
            res.status(400).json({
                error: 'Invalid task ID'
            });
            return;
        }

        if (completed_at !== undefined) {
            res.status(400).json({
                error: 'Invalid payload format. Use { "completed": true/false } instead of "completed_at"'
            });
            return;
        }

        if (completed === undefined || typeof completed !== 'boolean') {
            res.status(400).json({
                error: 'Required field "completed" must be a boolean'
            });
            return;
        }

        try {
            const task = await taskRepository.markTaskCompleted(
                taskId,
                completed ? new Date() : null
            );
            res.status(200).json(task);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Task not found') {
                    res.status(404).json({ error: 'Task not found' });
                    return;
                }
                if (error.message === 'Task must be in Done status to be marked as completed') {
                    res.status(400).json({ error: error.message });
                    return;
                }
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = parseInt(req.params.taskId);
        if (!req.user) throw new UnauthorizedError();
        const userId = req.user.id;

        if (isNaN(taskId)) {
            res.status(400).json({
                error: 'Invalid task ID'
            });
            return;
        }

        try {
            const task = await taskRepository.deleteTask(taskId, userId);
            res.status(200).json(task);
        } catch (error) {
            if (error instanceof Error && error.message === 'Task not found') {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const getTaskStatusHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = parseInt(req.params.taskId);

        if (isNaN(taskId)) {
            res.status(400).json({
                error: 'Invalid task ID'
            });
            return;
        }

        const history = await taskRepository.getTaskStatusHistory(taskId);
        
        if (history.length === 0) {
            res.status(404).json({
                error: 'No history found for this task'
            });
            return;
        }

        res.status(200).json(history);
    } catch (error) {
        next(error);
    }
};

export const getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tasks = await taskRepository.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const taskId = parseInt(req.params.taskId);

        if (isNaN(taskId)) {
            res.status(400).json({
                error: 'Invalid task ID'
            });
            return;
        }

        try {
            const task = await taskRepository.getTaskById(taskId);
            res.status(200).json(task);
        } catch (error) {
            if (error instanceof Error && error.message === 'Task not found') {
                res.status(404).json({ error: 'Task not found' });
                return;
            }
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

export const getAllTeamTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const teamId = Number(req.params.teamId);
    if (!teamId) {
      res.status(400).json({ error: 'Invalid or missing teamId' });
      return;
    }

    const tasks = await taskRepository.getTasksByTeam(teamId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
