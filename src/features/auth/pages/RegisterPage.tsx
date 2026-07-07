import { Helmet } from 'react-helmet-async';

import { OtpInput } from '@/features/auth/components/OtpInput';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useOtp } from '@/features/auth/hooks/useOtp';
import { useRegister } from '@/features/auth/hooks/useRegister';

/**
 * Page component: two-step registration — details form, then OTP
 * verification (Section 10.1 Registration Journey steps 2–4).
 */
export default function RegisterPage(): JSX.Element {
  const { register, isPending: isRegistering, error: registerError, registeredMobile } = useRegister();
  const { verifyOtp, isPending: isVerifying, error: otpError } = useOtp(registeredMobile ?? '');

  return (
    <>
      <Helmet>
        <title>Create account — RailBite</title>
        <meta name="description" content="Create a RailBite account to order food to your train seat." />
      </Helmet>
      <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
        <h1 className="text-2xl font-bold text-neutral-900">
          {registeredMobile ? 'Verify your mobile' : 'Create your account'}
        </h1>

        {registeredMobile ? (
          <OtpInput
            mobile={registeredMobile}
            onSubmit={verifyOtp}
            isSubmitting={isVerifying}
            serverError={otpError}
          />
        ) : (
          <RegisterForm onSubmit={register} isSubmitting={isRegistering} serverError={registerError} />
        )}
      </div>
    </>
  );
}
