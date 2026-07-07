import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/loginSchema';
import { ROUTES } from '@/routes/routePaths';

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting: boolean;
  serverError: string | null;
}

/**
 * Feature component: login form (Section 6.5 pattern, Section 8.6 forms
 * architecture). Owns only form state/validation; the actual login request
 * is delegated to the `useLogin` container hook via `onSubmit`.
 */
export function LoginForm({ onSubmit, isSubmitting, serverError }: LoginFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Input
        label="Mobile number or email"
        autoComplete="username"
        error={errors.identifier?.message}
        {...register('identifier')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex justify-end">
        <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-brand-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting}>
        Log in
      </Button>

      <p className="text-center text-sm text-neutral-600">
        New to RailBite?{' '}
        <Link to={ROUTES.REGISTER} className="text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
