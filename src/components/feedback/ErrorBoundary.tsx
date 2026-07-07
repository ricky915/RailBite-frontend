import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI; receives the caught error and a `reset()` callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render errors; shows fallback UI; logs to Sentry (Section 6.5
 * `<ErrorBoundary />` / Section 18.2). This is the one intentional exception
 * to the "functional components only" rule (Section 25.2) — React only
 * supports error boundaries via class components (`componentDidCatch` /
 * `getDerivedStateFromError` have no Hooks equivalent).
 *
 * NOTE: Sentry Browser SDK wiring is out of scope for this scaffold (no
 * `@sentry/react` dependency was requested); the `console.error` call below
 * is the integration point to swap in `Sentry.captureException`.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] Uncaught render error:', error, errorInfo.componentStack);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  public render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (!error) return children;

    if (fallback) return fallback(error, this.reset);

    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h2 className="text-lg font-semibold text-neutral-900">Something went wrong</h2>
        <p className="max-w-sm text-sm text-neutral-500">
          We hit an unexpected error. Please try again — if this keeps happening, contact support.
        </p>
        <Button onClick={this.reset}>Try again</Button>
      </div>
    );
  }
}
