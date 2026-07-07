import { z } from 'zod';

import { passwordSchema } from '@/utils/validation';

/** Forgot-password request schema (Section 13.4). Accepts mobile or email. */
export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Enter your mobile number or email.'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/** Reset-password schema — submitted with the OTP-derived reset token (Section 13.4). */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
