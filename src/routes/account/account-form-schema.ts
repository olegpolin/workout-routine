import { z } from 'zod';

export const accountFormSchema = z.object({
  full_name: z.string().min(1, 'Display name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
});

export type AccountFormSchema = typeof accountFormSchema;
