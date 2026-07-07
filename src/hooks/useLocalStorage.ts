import { useCallback, useState } from 'react';

/**
 * `useState` backed by `localStorage`. Used for small, non-Zustand UI
 * preferences that need to survive a refresh (e.g. "last selected station").
 * Global auth/cart state should use the Zustand stores instead (Section 15.1).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((previous: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((previous: T) => T)) => {
      setStoredValue((previous) => {
        const nextValue = value instanceof Function ? value(previous) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // localStorage may be unavailable (private browsing quota, etc.) —
          // fail silently, the in-memory state still updates.
        }
        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
