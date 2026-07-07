/**
 * Debounce a function so it only runs after `waitMs` of inactivity
 * (Section 3.4 `debounce()`; default 300ms per Section 8.7 search-as-you-type).
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  waitMs = 300,
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args): void => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, waitMs);
  };
}
