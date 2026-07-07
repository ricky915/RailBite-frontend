import { z } from 'zod';

import { emailSchema, indianMobileSchema, nameSchema, passwordSchema } from '@/utils/validation';

/**
 * Registration form schema (Section 11.1 / 17.2 / 17.4).
 */
export const registerSchema = z
  .object({
    name: nameSchema,
    mobile: indianMobileSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
