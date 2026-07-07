import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { verifyOtpSchema, type VerifyOtpFormValues } from '@/features/auth/schemas/otpSchema';

const RESEND_COOLDOWN_SECONDS = 60;
const MAX_RESEND_ATTEMPTS = 3;

export interface OtpInputProps {
  mobile: string;
  onSubmit: (otp: string) => void;
  onResend?: () => void;
  isSubmitting: boolean;
  serverError: string | null;
}

/**
 * OTP entry + resend control (Section 10.1 step 4 / Section 11.1 business
 * rules: OTP valid 10 minutes, resend after 60s, max 3 resends per session).
 */
export function OtpInput({ mobile, onSubmit, onResend, isSubmitting, serverError }: OtpInputProps): JSX.Element {
  const [secondsRemaining, setSecondsRemaining] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendCount, setResendCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setTimeout(() => setSecondsRemaining((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsRemaining]);

  const handleResend = (): void => {
    if (secondsRemaining > 0 || resendCount >= MAX_RESEND_ATTEMPTS) return;
    onResend?.();
    setResendCount((count) => count + 1);
    setSecondsRemaining(RESEND_COOLDOWN_SECONDS);
  };

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.otp))}
      className="flex flex-col gap-4"
      noValidate
    >
      {serverError && <Alert variant="error">{serverError}</Alert>}

      <p className="text-sm text-neutral-600">
        Enter the 6-digit code sent to <span className="font-medium">{mobile}</span>.
      </p>

      <Input
        label="OTP"
        inputMode="numeric"
        maxLength={6}
        autoComplete="one-time-code"
        error={errors.otp?.message}
        {...register('otp')}
      />

      <Button type="submit" isLoading={isSubmitting} disabled={!isValid || isSubmitting}>
        Verify
      </Button>

      <button
        type="button"
        onClick={handleResend}
        disabled={secondsRemaining > 0 || resendCount >= MAX_RESEND_ATTEMPTS}
        className="text-sm text-brand-600 hover:underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
      >
        {resendCount >= MAX_RESEND_ATTEMPTS
          ? 'Maximum resend attempts reached'
          : secondsRemaining > 0
            ? `Resend OTP in ${secondsRemaining}s`
            : 'Resend OTP'}
      </button>
    </form>
  );
}
