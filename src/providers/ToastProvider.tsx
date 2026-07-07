import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Toast, type ToastData, type ToastVariant } from '@/components/feedback/Toast';
import { TOAST_DEFAULT_DURATION_MS } from '@/config/constants';
import {
  API_EVENT_OFFLINE,
  API_EVENT_RATE_LIMITED,
  API_EVENT_SERVER_ERROR,
} from '@/lib/axios';

export interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Global toast notification provider (Section 3.5.1 provider tree). Renders
 * an `aria-live` region (Section 8.10) and exposes `useToast()` for
 * mutation/query error handling (Section 18.2). Also listens for the
 * connectivity/rate-limit/server-error events emitted by the Axios response
 * interceptor (Section 16.3 / 18.3) so those surface as toasts without
 * `lib/axios.ts` importing this provider directly (Section 5.4 dependency rules).
 */
export function ToastProvider({ children }: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, variant }]);
      setTimeout(() => dismissToast(id), TOAST_DEFAULT_DURATION_MS);
    },
    [dismissToast],
  );

  useEffect(() => {
    const handleOffline = (): void =>
      showToast('You are offline. Please check your connection.', 'error');
    const handleRateLimited = (): void =>
      showToast('Too many requests. Please slow down and try again.', 'warning');
    const handleServerError = (): void =>
      showToast('Something went wrong on our end. Please try again shortly.', 'error');

    window.addEventListener(API_EVENT_OFFLINE, handleOffline);
    window.addEventListener(API_EVENT_RATE_LIMITED, handleRateLimited);
    window.addEventListener(API_EVENT_SERVER_ERROR, handleServerError);

    return () => {
      window.removeEventListener(API_EVENT_OFFLINE, handleOffline);
      window.removeEventListener(API_EVENT_RATE_LIMITED, handleRateLimited);
      window.removeEventListener(API_EVENT_SERVER_ERROR, handleServerError);
    };
  }, [showToast]);

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
        >
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

/** Read the `showToast` function from the nearest `ToastProvider`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
