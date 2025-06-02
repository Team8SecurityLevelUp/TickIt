import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, email } = req.body;
        const user = await userService.registerUser(username, password, email);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};