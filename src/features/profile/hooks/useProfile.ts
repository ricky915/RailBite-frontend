import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import { useToast } from '@/providers/ToastProvider';
import { useAuthStore } from '@/store/authStore';
import { parseApiError } from '@/utils/apiErrors';

import { profileApi } from '@/features/profile/services/profileApi';
import type { UpdateProfileFormValues } from '@/features/profile/schemas/profileSchema';

/**
 * Container hook for the profile page (Section 6.2 / Section 11.2). Updates
 * both the TanStack Query cache and the Zustand auth store's `user` snapshot
 * on success (Section 15.2 — "Update Profile → invalidateQueries(users.profile)").
 */
export function useProfile() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const updateUser = useAuthStore((state) => state.updateUser);

  const query = useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: profileApi.getMe,
  });

  const updateMutation = useMutation({
    mutationFn: (values: UpdateProfileFormValues) => profileApi.updateMe(values),
    onSuccess: (user) => {
      updateUser(user);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      showToast('Profile updated.', 'success');
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error ? parseApiError(updateMutation.error) : null,
  };
}
