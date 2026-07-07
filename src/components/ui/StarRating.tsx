import { useState } from 'react';

import { RATING_MAX_STARS } from '@/config/constants';
import { cn } from '@/utils/cn';

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<StarRatingProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

/**
 * 5-star rating widget; interactive or display-only (Section 6.5 `<StarRating />`).
 */
export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  className,
}: StarRatingProps): JSX.Element {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  return (
    <div
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of ${RATING_MAX_STARS} stars`}
      className={cn('inline-flex items-center gap-1', className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {Array.from({ length: RATING_MAX_STARS }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayValue;

        return (
          <button
            key={starValue}
            type="button"
            disabled={readOnly}
            role={readOnly ? undefined : 'radio'}
            aria-checked={readOnly ? undefined : starValue === value}
            aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
            onClick={() => !readOnly && onChange?.(starValue)}
            className={cn(
              'text-warning-500 disabled:cursor-default',
              !readOnly && 'cursor-pointer',
            )}
          >
            <svg
              viewBox="0 0 20 20"
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={1.5}
              className={SIZE_CLASSES[size]}
              aria-hidden="true"
            >
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.9l-5.21 2.74 1-5.8-4.21-4.1 5.82-.85L10 1.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
