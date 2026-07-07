import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/**
 * Consistent empty state with optional CTA button (Section 6.5 `<EmptyState />`
 * / Section 8.8 — empty states include a descriptive message and a suggested
 * action CTA).
 */
export function EmptyState({ title, description, action, icon, className }: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 px-4 py-12 text-center', className)}>
      {icon}
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
