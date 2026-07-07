import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTES } from '@/routes/routePaths';
import { selectIsAuthenticated, useAuthStore } from '@/store/authStore';

/**
 * JWT-guarded route wrapper (Section 8.1.2). If there is no access token,
 * redirect to `/login` with the attempted location preserved as `returnUrl`
 * router state, so `LoginPage` can navigate back after a successful login.
 * Token *expiry* (not just absence) is handled transparently by the Axios
 * response interceptor's refresh flow (Section 8.2) — by the time a guarded
 * page's data fetch runs, an expired token has already been silently renewed
 * or the user has already been redirected to `/login` by that interceptor.
 */
export function PrivateRoutes(): JSX.Element {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ returnUrl: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return <Outlet />;
}
