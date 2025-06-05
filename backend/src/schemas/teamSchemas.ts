import { z } from 'zod';

export const teamCreationSchema = z.object({
  teamName: z.string()
    .min(3, { message: 'Team name must be at least 3 characters' })
    .max(30, { message: 'Team name must be at most 30 characters' }),
});

export const teamJoinSchema = z.object({
  teamId: z.number().int().positive(),
  roleType: z.enum(['TeamLead', 'ToDoUser'])
});