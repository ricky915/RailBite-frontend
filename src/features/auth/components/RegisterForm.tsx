import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/registerSchema';
import { ROUTES } from '@/routes/routePaths';

export interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void;
  isSubmitting: boolean;
  serverError: string | null;
}

/**
 * Feature component: registration form (Section 10.1 Registration Journey /
 * Section 17.2). Zod is the single source of validation truth; error
 * messages are defined inside the schema itself.
 */
export function RegisterForm({ onSubmit, isSubmitting, serverError }: RegisterFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />

      <Input
        label="Mobile number"
        type="tel"
        autoComplete="tel"
        error={errors.mobile?.message}
        {...register('mobile')}
      />

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters, with uppercase, lowercase, a digit, and a symbol."
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting}>
        Create account
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
