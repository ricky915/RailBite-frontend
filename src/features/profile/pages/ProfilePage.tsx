import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { formatMobileNumber } from '@/utils/formatters';

import { useProfile } from '@/features/profile/hooks/useProfile';
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from '@/features/profile/schemas/profileSchema';

/** Page component: profile (Section 11.2 User Profile Module). */
export default function ProfilePage(): JSX.Element {
  const { profile, isLoading, updateProfile, isUpdating, updateError } = useProfile();
  const sessionUser = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (profile) reset({ name: profile.name, email: profile.email });
  }, [profile, reset]);

  if (isLoading) {
    return <Skeleton height={300} className="rounded-xl" />;
  }

  return (
    <>
      <Helmet>
        <title>Your profile — RailBite</title>
      </Helmet>

      <div className="mx-auto flex max-w-sm flex-col gap-6 py-10">
        <h1 className="text-2xl font-bold text-neutral-900">Your profile</h1>

        {updateError && <Alert variant="error">{updateError}</Alert>}

        <form onSubmit={handleSubmit((values) => updateProfile(values))} className="flex flex-col gap-4" noValidate>
          <Input label="Full name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input
            label="Mobile number"
            value={sessionUser ? formatMobileNumber(sessionUser.mobile) : ''}
            disabled
            hint="Changing your mobile number requires OTP re-verification (contact support)."
          />

          <Button type="submit" isLoading={isUpdating} disabled={!isDirty || isUpdating}>
            Save changes
          </Button>
        </form>
      </div>
    </>
  );
}
