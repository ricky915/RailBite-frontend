import { useEffect, useState } from 'react';

import { SEARCH_DEBOUNCE_MS } from '@/config/constants';

/**
 * Returns a debounced copy of `value`, updated `delayMs` after the last change.
 * Used for search-as-you-type inputs (Section 8.7 — 300ms default).
 */
export function useDebounce<T>(value: T, delayMs: number = SEARCH_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
