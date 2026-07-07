import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';
import type { User } from '@/types/domain.types';

import type { UpdateProfileFormValues } from '@/features/profile/schemas/profileSchema';

/**
 * Axios calls for the profile feature (Section 11.2 User Profile Module).
 * NOTE: Section 11.4's endpoint table doesn't enumerate profile routes
 * explicitly — `/users/me` follows the same REST conventions used
 * everywhere else (Section 11.1: plural resource + `/me` self-reference is
 * a standard convention for "the current authenticated user").
 */
export const profileApi = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<User>>('/users/me');
    return data.data;
  },

  updateMe: async (payload: UpdateProfileFormValues): Promise<User> => {
    const { data } = await apiClient.patch<ApiSuccessEnvelope<User>>('/users/me', payload);
    return data.data;
  },
};
