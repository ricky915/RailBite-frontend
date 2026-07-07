import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';

import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from '@/features/auth/types/auth.types';

/**
 * Axios calls for the auth feature (Section 11.4 endpoint table). Every
 * request goes through the shared `apiClient` instance (Section 8.2 Design
 * Rule) — never `fetch()` or a raw `axios` import.
 */
export const authApi = {
  register: async (payload: RegisterPayload): Promise<{ userId: string }> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<{ userId: string }>>(
      '/auth/register',
      payload,
    );
    return data.data;
  },

  verifyRegistrationOtp: async (payload: VerifyOtpPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<LoginResponse>>(
      '/auth/verify-otp',
      payload,
    );
    return data.data;
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<LoginResponse>>(
      '/auth/login',
      payload,
    );
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await apiClient.post('/auth/forgot-password', payload);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await apiClient.post('/auth/reset-password', payload);
  },
};
