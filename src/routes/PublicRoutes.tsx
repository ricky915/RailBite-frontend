import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTES } from '@/routes/routePaths';
import { selectIsAuthenticated, useAuthStore } from '@/store/authStore';

/**
 * Guest-only route wrapper (Section 8.1.2) for auth pages (login/register/
 * forgot-password) — an already-authenticated user visiting `/login` is
 * redirected to their intended destination (or home) instead of seeing the
 * form again. Truly public pages that guests AND logged-in users can both
 * view (home, search, restaurant listing) are NOT wrapped by this guard —
 * they are mounted directly under the root layout route.
 */
export function PublicRoutes(): JSX.Element {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const state = location.state as { returnUrl?: string } | null;
    return <Navigate to={state?.returnUrl ?? ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
