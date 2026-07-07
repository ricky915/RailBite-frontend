import { z } from 'zod';

/** Coupon code entry schema (Section 11.9 — 4–20 alphanumeric, case-insensitive). */
export const couponCodeSchema = z.object({
  code: z
    .string()
    .min(4, 'Coupon code must be at least 4 characters.')
    .max(20, 'Coupon code must be at most 20 characters.')
    .regex(/^[A-Za-z0-9]+$/, 'Coupon code can only contain letters and numbers.')
    .transform((value) => value.toUpperCase()),
});

export type CouponCodeFormValues = z.infer<typeof couponCodeSchema>;
