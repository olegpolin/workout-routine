import { z } from 'zod';

export const profilePictureFormSchema = z.object({
  profilePicture: z.file().mime(['image/png, image/jpeg']),
});

export type ProfilePictureFormSchema = typeof profilePictureFormSchema;
