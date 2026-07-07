import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/features/auth/services/authApi';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/forgotPasswordSchema';
import { ROUTES } from '@/routes/routePaths';
import { parseApiError } from '@/utils/apiErrors';

/**
 * Page component: forgot-password request (Section 10.2 / Section 13.4).
 * Deliberately shows a generic success message regardless of whether the
 * identifier matched an account, to avoid leaking account existence.
 */
export default function ForgotPasswordPage(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
  });

  return (
    <>
      <Helmet>
        <title>Forgot password — RailBite</title>
      </Helmet>
      <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
        <h1 className="text-2xl font-bold text-neutral-900">Reset your password</h1>

        {mutation.isSuccess ? (
          <Alert variant="success" title="Check your inbox">
            If an account matches, we&apos;ve sent password reset instructions. The link is valid
            for 30 minutes.
          </Alert>
        ) : (
          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="flex flex-col gap-4"
            noValidate
          >
            {mutation.isError && <Alert variant="error">{parseApiError(mutation.error)}</Alert>}

            <Input
              label="Mobile number or email"
              error={errors.identifier?.message}
              {...register('identifier')}
            />

            <Button type="submit" isLoading={mutation.isPending} disabled={!isValid || mutation.isPending}>
              Send reset instructions
            </Button>
          </form>
        )}

        <Link to={ROUTES.LOGIN} className="text-center text-sm text-brand-600 hover:underline">
          Back to login
        </Link>
      </div>
    </>
  );
}
