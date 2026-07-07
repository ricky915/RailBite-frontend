import { z } from 'zod';

/**
 * Shared Zod validation primitives (Section 17.4). Mirrors the backend's
 * `validations/common.validations.ts` so both layers apply the exact same
 * rules — imported by every feature's `schemas/*.schema.ts` file. Not
 * explicitly named in the Section 4.1 folder tree, but Section 17.4 calls
 * for these primitives to be shared/imported by feature schemas, and
 * `utils/` is the one shared layer feature schemas are allowed to depend on
 * (Section 5.4).
 */

export const indianMobileSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.');

export const emailSchema = z
  .string()
  .email('Enter a valid email address.')
  .max(100, 'Email must be at most 100 characters.')
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter.')
  .regex(/[a-z]/, 'Password must contain a lowercase letter.')
  .regex(/\d/, 'Password must contain a digit.')
  .regex(/[^\w]/, 'Password must contain a special character.');

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid identifier.');

export const pnrSchema = z.string().regex(/^\d{10}$/, 'PNR must be exactly 10 digits.');

export const trainNumberSchema = z.string().regex(/^\d{5}$/, 'Train number must be 5 digits.');

export const coachNumberSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{1,4}$/, 'Enter a valid coach (e.g. S2, A1).');

export const seatNumberSchema = z
  .string()
  .regex(/^\d{1,3}$/, 'Enter a valid seat number.');

export const inrAmountSchema = z
  .number()
  .positive('Amount must be greater than zero.')
  .multipleOf(0.01, 'Amount can have at most 2 decimal places.');

export const otpSchema = z.string().regex(/^\d{6}$/, 'Enter the 6-digit OTP.');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters.')
  .max(50, 'Name must be at most 50 characters.')
  .regex(/^[A-Za-z\s-]+$/, 'Name can only contain letters, spaces, and hyphens.');
