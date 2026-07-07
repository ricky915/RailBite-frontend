import { z } from 'zod';

import { emailSchema, nameSchema } from '@/utils/validation';

/** Profile edit schema (Section 11.2 User Profile Module). */
export const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
