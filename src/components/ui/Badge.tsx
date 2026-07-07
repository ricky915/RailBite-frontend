import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export type BadgeVariant = 'active' | 'error' | 'pending' | 'inactive';

export interface BadgeProps {
  variant: BadgeVariant;
  label: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  active: 'bg-success-50 text-success-700',
  error: 'bg-danger-50 text-danger-700',
  pending: 'bg-warning-50 text-warning-700',
  inactive: 'bg-neutral-100 text-neutral-600',
};

/**
 * Status badge (Section 6.5 `<Badge />`): green=active, red=error,
 * amber=pending, gray=inactive.
 */
export function Badge({ variant, label, className }: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
