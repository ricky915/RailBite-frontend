import { z } from 'zod';

/**
 * Login form schema (Section 11.1 / 17.2). Login accepts mobile OR email as
 * the identifier, so it only checks non-emptiness here — the backend
 * determines which field matched. Full format/complexity rules apply at
 * registration (`registerSchema.ts`), not at login.
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Enter your mobile number or email.')
    .max(100, 'That value is too long.'),
  password: z.string().min(1, 'Enter your password.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
