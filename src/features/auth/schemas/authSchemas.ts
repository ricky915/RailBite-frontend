import { z } from "zod";

const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

const passwordRulesSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-zA-Z]/, "Must contain a letter")
  .regex(/[0-9]/, "Must contain a number");

export const loginSchema = z.object({
  mobile: mobileSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  mobile: mobileSchema,
  password: passwordRulesSchema,
});
export type SignupFormValues = z.infer<typeof signupSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Digits only"),
});
export type OtpFormValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  mobile: mobileSchema,
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Digits only"),
  newPassword: passwordRulesSchema,
});
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
