import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { authApi } from '@/features/auth/services/authApi';
import type { RegisterPayload } from '@/features/auth/types/auth.types';
import { useToast } from '@/providers/ToastProvider';
import { parseApiError } from '@/utils/apiErrors';

/**
 * Container hook for the registration step (Section 6.2 / Section 10.1
 * Registration Journey step 3). Registration itself only creates a pending
 * account and dispatches an OTP — `useOtp` handles the verification step
 * that actually establishes the session.
 */
export function useRegister() {
  const { showToast } = useToast();
  const [registeredMobile, setRegisteredMobile] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (_data, variables) => {
      setRegisteredMobile(variables.mobile);
      showToast('OTP sent to your mobile number.', 'success');
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    register: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error ? parseApiError(mutation.error) : null,
    registeredMobile,
  };
}
