import { z } from 'zod';

export const accountFormSchema = z.object({
  full_name: z.string().min(1, 'Display name is required'),
  username: z.string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters long')
    .max(100, 'Username must be at most 100 characters long')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Username must be lowercase and can only include letters, numbers, and single dashes'
    ),
});

export type AccountFormSchema = typeof accountFormSchema;
