import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

import { PageSpinner } from '@/components/feedback/PageSpinner';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types/domain.types';

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * JWT state + refresh logic provider (Section 3.5.1 provider tree). The
 * actual token attach/refresh mechanics live in `lib/axios.ts` interceptors,
 * which read `useAuthStore` directly (Section 3.1.3 — Zustand stores are
 * imported directly, no provider required for that). This provider's job is
 * narrower: gate rendering until the persisted auth state has hydrated from
 * localStorage, so children never see a false "logged out" flash on refresh
 * (Section 15.3 — hydration on app mount).
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // Zustand's persist middleware hydrates asynchronously; if hydration has
    // already happened before this effect runs (e.g. fast localStorage read),
    // `setHasHydrated` was already called by `onRehydrateStorage`. This guard
    // covers the (rare) case where hydration finished before mount.
    if (!useAuthStore.persist.hasHydrated()) return;
    useAuthStore.getState().setHasHydrated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: Boolean(accessToken && user) }),
    [user, accessToken],
  );

  if (!hasHydrated) {
    return <PageSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Read the current auth context (user + isAuthenticated flag). */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
