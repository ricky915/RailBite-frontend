/**
 * Full-page centered loading indicator (Section 6.5 `<PageSpinner />`).
 * Used as the Suspense fallback for lazy-loaded routes (Section 8.1.3).
 */
export function PageSpinner(): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex min-h-[50vh] w-full items-center justify-center"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
