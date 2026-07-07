import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/features/auth/services/authApi';
import { useToast } from '@/providers/ToastProvider';
import { ROUTES } from '@/routes/routePaths';
import { useAuthStore } from '@/store/authStore';
import { parseApiError } from '@/utils/apiErrors';

/**
 * Container hook to verify the registration OTP (Section 10.1 step 4 /
 * Section 13.4). On success the account is fully created and the returned
 * tokens establish the session, same as a normal login.
 */
export function useOtp(mobile: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (otp: string) => authApi.verifyRegistrationOtp({ mobile, otp }),
    onSuccess: (response) => {
      setAuth(response);
      showToast('Account verified! Welcome to RailBite.', 'success');
      navigate(ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    verifyOtp: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error ? parseApiError(mutation.error) : null,
  };
}
