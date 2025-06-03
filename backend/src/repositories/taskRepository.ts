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
    }
};