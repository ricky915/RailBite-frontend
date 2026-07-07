import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Form input with label, error display, and react-hook-form integration
 * (Section 6.5 `<Input />`). Forwarded ref allows direct use with RHF's
 * `register()`: `<Input label="Mobile" {...register('mobile')} error={errors.mobile?.message} />`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          'h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm text-neutral-900',
          'placeholder:text-neutral-400 focus-visible:border-brand-500',
          error && 'border-danger-500 focus-visible:ring-danger-500',
          className,
        )}
        {...rest}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-sm text-neutral-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
});
