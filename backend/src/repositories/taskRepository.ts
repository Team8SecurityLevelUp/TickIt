import db from '../config/database';
import { Task } from '../models/Tasks';

export default {
    async insertTask(
        teamId: number,
        title: string,
        description: string,
        statusId: number,
        createdBy: number,
        assignedTo: number | null,
        createdAt: Date,
        dueDate: Date,
        completedAt: Date | null
    ): Promise<Task> {
        const result = await db.query(
            `
            WITH tasks AS (
                INSERT INTO tasks (team_id, title, description, status_id, created_by_user_id, assigned_user_id, created_at, due_date, completed_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
            )
            SELECT
                tasks.id as "taskId",
                tasks.title,
                tasks.description,
                tasks.created_at as "createdAt",
                tasks.due_date as "dueDate",
                tasks.completed_at as "completedAt",
                teams.team_name as "teamName",
                task_statuses.status as "status",
                creator.username as "createdByUsername",
                assignee.username as "assignedToUsername"
            FROM tasks
            JOIN teams ON tasks.team_id = teams.id
            JOIN task_statuses ON tasks.status_id = task_statuses.id
            JOIN users creator ON tasks.created_by_user_id = creator.id
            LEFT JOIN users assignee ON tasks.assigned_user_id = assignee.id
            `,
            [teamId, title, description, statusId, createdBy, assignedTo, createdAt, dueDate, completedAt]
        );
        return result.rows[0];
    },

    async updateTaskStatus(
        taskId: number,
        newStatusId: number,
        changedByUserId: number
    ): Promise<Task> {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `UPDATE tasks 
                 SET status_id = $1
                 WHERE id = $2
                 RETURNING *`,
                [newStatusId, taskId]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('Task not found');
            }

            await client.query(
                `INSERT INTO task_status_history (task_id, new_status, changed_by)
                 VALUES ($1, $2, $3)`,
                [taskId, newStatusId, changedByUserId]
            );

            const result = await client.query(
                `SELECT
                    t.id as "taskId",
                    t.title,
                    t.description,
                    t.created_at as "createdAt",
                    t.due_date as "dueDate",
                    t.completed_at as "completedAt",
                    tm.team_name as "teamName",
                    ts.status as "status",
                    creator.username as "createdByUsername",
                    assignee.username as "assignedToUsername"
                FROM tasks t
                JOIN teams tm ON t.team_id = tm.id
                JOIN task_statuses ts ON t.status_id = ts.id
                JOIN users creator ON t.created_by_user_id = creator.id
                LEFT JOIN users assignee ON t.assigned_user_id = assignee.id
                WHERE t.id = $1`,
                [taskId]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async assignTask(
        taskId: number,
        assignedUserId: number | null
    ): Promise<Task> {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `UPDATE tasks 
                 SET assigned_user_id = $1
                 WHERE id = $2
                 RETURNING *`,
                [assignedUserId, taskId]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('Task not found');
            }

            const result = await client.query(
                `SELECT
                    t.id as "taskId",
                    t.title,
                    t.description,
                    t.created_at as "createdAt",
                    t.due_date as "dueDate",
                    t.completed_at as "completedAt",
                    tm.team_name as "teamName",
                    ts.status as "status",
                    creator.username as "createdByUsername",
                    assignee.username as "assignedToUsername"
                FROM tasks t
                JOIN teams tm ON t.team_id = tm.id
                JOIN task_statuses ts ON t.status_id = ts.id
                JOIN users creator ON t.created_by_user_id = creator.id
                LEFT JOIN users assignee ON t.assigned_user_id = assignee.id
                WHERE t.id = $1`,
                [taskId]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async updateTaskDetails(
        taskId: number,
        title: string,
        description: string
    ): Promise<Task> {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `UPDATE tasks 
                 SET title = $1, description = $2
                 WHERE id = $3
                 RETURNING *`,
                [title, description, taskId]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('Task not found');
            }

            const result = await client.query(
                `SELECT
                    t.id as "taskId",
                    t.title,
                    t.description,
                    t.created_at as "createdAt",
                    t.due_date as "dueDate",
                    t.completed_at as "completedAt",
                    tm.team_name as "teamName",
                    ts.status as "status",
                    creator.username as "createdByUsername",
                    assignee.username as "assignedToUsername"
                FROM tasks t
                JOIN teams tm ON t.team_id = tm.id
                JOIN task_statuses ts ON t.status_id = ts.id
                JOIN users creator ON t.created_by_user_id = creator.id
                LEFT JOIN users assignee ON t.assigned_user_id = assignee.id
                WHERE t.id = $1`,
                [taskId]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async markTaskCompleted(
        taskId: number,
        completedAt: Date | null
    ): Promise<Task> {
        const client = await db.connect();
        try {
            await client.query('BEGIN');


            const taskCheck = await client.query(
                `SELECT status_id 
                 FROM tasks 
                 WHERE id = $1`,
                [taskId]
            );

            if (taskCheck.rows.length === 0) {
                throw new Error('Task not found');
            }

            if (completedAt && taskCheck.rows[0].status_id !== 3) {
                throw new Error('Task must be in Done status to be marked as completed');
            }

            const updateResult = await client.query(
                `UPDATE tasks 
                 SET completed_at = $1::timestamp
                 WHERE id = $2
                 RETURNING *`,
                [completedAt, taskId]
            );

            const result = await client.query(
                `SELECT
                    t.id as "taskId",
                    t.title,
                    t.description,
                    t.created_at as "createdAt",
                    t.due_date as "dueDate",
                    t.completed_at as "completedAt",
                    tm.team_name as "teamName",
                    ts.status as "status",
                    creator.username as "createdByUsername",
                    assignee.username as "assignedToUsername"
                FROM tasks t
                JOIN teams tm ON t.team_id = tm.id
                JOIN task_statuses ts ON t.status_id = ts.id
                JOIN users creator ON t.created_by_user_id = creator.id
                LEFT JOIN users assignee ON t.assigned_user_id = assignee.id
                WHERE t.id = $1`,
                [taskId]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async deleteTask(
        taskId: number,
        userId: number
    ): Promise<Task> {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const updateResult = await client.query(
                `UPDATE tasks 
                 SET status_id = 4
                 WHERE id = $1
                 RETURNING *`,
                [taskId]
            );

            if (updateResult.rows.length === 0) {
                throw new Error('Task not found');
            }

            await client.query(
                `INSERT INTO task_status_history (task_id, new_status, changed_by)
                 VALUES ($1, 4, $2)`,
                [taskId, userId]
            );

            const result = await client.query(
                `SELECT
                    t.id as "taskId",
                    t.title,
                    t.description,
                    t.created_at as "createdAt",
                    t.due_date as "dueDate",
                    t.completed_at as "completedAt",
                    tm.team_name as "teamName",
                    ts.status as "status",
                    creator.username as "createdByUsername",
                    assignee.username as "assignedToUsername"
                FROM tasks t
                JOIN teams tm ON t.team_id = tm.id
                JOIN task_statuses ts ON t.status_id = ts.id
                JOIN users creator ON t.created_by_user_id = creator.id
                LEFT JOIN users assignee ON t.assigned_user_id = assignee.id
                WHERE t.id = $1`,
                [taskId]
            );

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
};