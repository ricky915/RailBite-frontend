import { cn } from '@/utils/cn';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}

/**
 * Loading skeleton placeholder matching content dimensions
 * (Section 6.5 `<Skeleton />` / Section 8.8 — skeletons match the shape and
 * dimensions of the content they replace).
 */
export function Skeleton({ width = '100%', height = '1rem', rounded = false, className }: SkeletonProps): JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-neutral-200', rounded ? 'rounded-full' : 'rounded-md', className)}
      style={{ width, height }}
    />
  );
}
