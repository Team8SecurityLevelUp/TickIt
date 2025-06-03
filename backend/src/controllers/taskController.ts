import type { Request, Response, NextFunction } from 'express';
import taskRepository from '../repositories/taskRepository';

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            teamId,
            title,
            description,
            statusId,
            createdByUserId,
            assignedUserId,
            dueDate
        } = req.body;

        if (!teamId || !title || !statusId || !createdByUserId || !dueDate) {
            res.status(400).json({
                error: 'Required fields missing: teamId, title, statusId, createdByUserId, and dueDate are required'
            });
            return;
        }

        const task = await taskRepository.insertTask(
            teamId,
            title,
            description || '',
            statusId,
            createdByUserId,
            assignedUserId || null,
            new Date(),
            new Date(dueDate),
            null
        );

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};