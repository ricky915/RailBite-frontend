import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { authApi } from '@/features/auth/services/authApi';
import type { LoginPayload } from '@/features/auth/types/auth.types';
import { useToast } from '@/providers/ToastProvider';
import { ROUTES } from '@/routes/routePaths';
import { useAuthStore } from '@/store/authStore';
import { parseApiError } from '@/utils/apiErrors';

/**
 * Container hook for the login flow (Section 6.2 Container Hook). Wraps a
 * TanStack Query mutation and writes the result into the Zustand auth store;
 * `LoginPage` only calls `login()` and reads `isPending`/`error` — it never
 * touches the store or Axios directly.
 */
export function useLogin(returnUrl?: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (response) => {
      setAuth(response);
      showToast(`Welcome back, ${response.user.name}!`, 'success');
      navigate(returnUrl ?? ROUTES.HOME, { replace: true });
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error ? parseApiError(mutation.error) : null,
  };
}
