import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';

import AppRoutes from '@/routes';

/**
 * Root component (Section 3.5.1 provider tree — innermost node, "route
 * definitions"). All cross-cutting providers (Router, QueryClient, Auth,
 * Toast, Helmet) are wired in `main.tsx`; this component only wraps the
 * router in a top-level `ErrorBoundary` (Section 6.5 `<ErrorBoundary />`).
 */
export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
