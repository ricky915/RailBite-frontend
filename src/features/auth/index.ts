// Public API of the auth feature (Section 5.2). Other features/routes
// should only import from here, never reach into auth/components|hooks|etc.
// directly (Section 5.4 — features must not import from other features).

export { default as LoginPage } from '@/features/auth/pages/LoginPage';
export { default as RegisterPage } from '@/features/auth/pages/RegisterPage';
export { default as ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
