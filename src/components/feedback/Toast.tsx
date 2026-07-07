import { cn } from '@/utils/cn';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
}

export interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  info: 'bg-neutral-900 text-white',
  success: 'bg-success-700 text-white',
  warning: 'bg-warning-700 text-white',
  error: 'bg-danger-700 text-white',
};

/**
 * A single toast notification. Rendered by `ToastProvider` inside an
 * `aria-live` region so screen readers announce dynamic content
 * (Section 8.10 — aria-live used for toast notifications, cart count updates).
 */
export function Toast({ id, variant, message, onDismiss }: ToastProps): JSX.Element {
  return (
    <div
      role="status"
      className={cn(
        'flex w-full max-w-sm items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm shadow-lg',
        VARIANT_CLASSES[variant],
      )}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
