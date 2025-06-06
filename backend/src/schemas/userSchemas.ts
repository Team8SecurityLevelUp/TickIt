import { z } from 'zod';
import zxcvbn from 'zxcvbn';

export const userCreationSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email' }),
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(50, { message: 'Username must be at most 50 characters' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((val) => zxcvbn(val).score >= 3, {
      message: 'Password is too weak. Try adding numbers, symbols, or uppercase letters.',
    }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
