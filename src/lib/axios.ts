import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_BASE_URL } from '@/config/constants';
import { useAuthStore } from '@/store/authStore';

/**
 * Configured Axios instance (Section 8.2 / 16.1). This is the ONLY Axios
 * instance in the app — no component or hook may use `fetch()` or import
 * Axios directly (Section 8.2 Design Rule). Feature services import this
 * shared instance from `services/*Api.ts` files.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // Authorization header, not cookies (Section 16.1)
});

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/** Broadcast API-level events the UI (ToastProvider) can subscribe to without
 * creating a circular import between `lib/` and `providers/` (Section 5.4:
 * utils/lib must not depend on providers/components). */
export const API_EVENT_OFFLINE = 'railbite:api-offline';
export const API_EVENT_RATE_LIMITED = 'railbite:api-rate-limited';
export const API_EVENT_SERVER_ERROR = 'railbite:api-server-error';

function emitApiEvent(eventName: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(eventName));
}

// ---------------------------------------------------------------------------
// REQUEST interceptor: attach Bearer token + correlation ID (Section 8.2 / 16.2)
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Request correlation ID for tracing (Section 16.2).
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    config.headers['X-Request-ID'] = crypto.randomUUID();
  }

  return config;
});

// ---------------------------------------------------------------------------
// 401 refresh-and-retry flow (Section 8.2 / 13.2 / 16.3)
// ---------------------------------------------------------------------------
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null): void {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
}

async function refreshTokenRequest(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  // Deliberately use a bare axios call (not `apiClient`) to avoid recursively
  // triggering this same response interceptor.
  const response = await axios.post<{
    data: { accessToken: string; refreshToken: string };
  }>(`${API_BASE_URL}/auth/refresh`, { refreshToken });

  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  useAuthStore.getState().setAuth({
    accessToken,
    refreshToken: newRefreshToken,
    user: useAuthStore.getState().user!,
  });
  return accessToken;
}

function redirectToLogin(): void {
  useAuthStore.getState().clearAuth();
  if (typeof window === 'undefined') return;
  const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.href = `/login?returnUrl=${returnUrl}`;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    // Network error (no response at all): offline or server unreachable (Section 18.3).
    if (!error.response) {
      emitApiEvent(API_EVENT_OFFLINE);
      return Promise.reject(error);
    }

    const { status } = error.response;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      // The refresh endpoint itself returning 401 must not loop.
      if (originalRequest.url?.includes('/auth/refresh')) {
        redirectToLogin();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // A refresh is already in flight; queue this request until it resolves.
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refreshTokenRequest();
        flushQueue(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return await apiClient(originalRequest);
      } catch (refreshError) {
        flushQueue(null);
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 429) {
      emitApiEvent(API_EVENT_RATE_LIMITED);
    } else if (status >= 500) {
      emitApiEvent(API_EVENT_SERVER_ERROR);
    }

    return Promise.reject(error);
  },
);
