import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  info: 'bg-neutral-50 text-neutral-700 border-neutral-200',
  success: 'bg-success-50 text-success-700 border-success-500/30',
  warning: 'bg-warning-50 text-warning-700 border-warning-500/30',
  error: 'bg-danger-50 text-danger-700 border-danger-500/30',
};

/**
 * Inline alert banner — used for form-level/API error messages, delivery
 * window warnings, maintenance banners (Section 8.8 / 18.4).
 */
export function Alert({ variant = 'info', title, children, onDismiss, className }: AlertProps): JSX.Element {
  return (
    <div
      role="alert"
      className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 text-sm', VARIANT_CLASSES[variant], className)}
    >
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-current opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}
