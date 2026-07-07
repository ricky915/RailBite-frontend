import { z } from 'zod';

import { otpSchema as otpFieldSchema } from '@/utils/validation';

/** OTP verification form schema (Section 11.1 — registration OTP step). */
export const verifyOtpSchema = z.object({
  otp: otpFieldSchema,
});

export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
