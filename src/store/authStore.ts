import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ACCESS_TOKEN_STORAGE_KEY } from '@/config/constants';
import type { User } from '@/types/domain.types';

export interface AuthState {
  /** Short-lived (1hr) JWT, attached as a Bearer header by the Axios request interceptor. */
  accessToken: string | null;
  /** Long-lived (7d) JWT used only to obtain a new access token (Section 13.3). */
  refreshToken: string | null;
  /** Snapshot of the logged-in user, refreshed on login and profile update. */
  user: User | null;
  /** True once the persist middleware has finished reading from localStorage. */
  hasHydrated: boolean;
}

export interface AuthActions {
  setAuth: (payload: { accessToken: string; refreshToken: string; user: User }) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (user: User) => void;
  clearAuth: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  hasHydrated: false,
};

/**
 * Zustand auth store (Section 8.5 pattern / Section 15.3 persistence).
 * Persisted to localStorage under the `railbite-auth` key. Imported directly
 * by the Axios interceptors (`lib/axios.ts`) via `useAuthStore.getState()` —
 * no provider wrapping required (Section 3.1.3).
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setAuth: ({ accessToken, refreshToken, user }) => {
        set({ accessToken, refreshToken, user });
      },

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      updateUser: (user) => {
        set({ user });
      },

      clearAuth: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },

      setHasHydrated: (hasHydrated) => {
        set({ hasHydrated });
      },
    }),
    {
      name: ACCESS_TOKEN_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

/** Convenience selector for guard components/hooks (Section 8.1.2). */
export function selectIsAuthenticated(state: AuthState): boolean {
  return Boolean(state.accessToken && state.user);
}
