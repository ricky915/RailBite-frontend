import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { couponCodeSchema, type CouponCodeFormValues } from '@/features/coupons/schemas/couponSchema';
import { useCoupon } from '@/features/coupons/hooks/useCoupon';

/**
 * Feature component: coupon code input + validation feedback (Section 6.5 /
 * Section 11.9 Coupon Module — "Apply coupon code at cart/checkout stage").
 */
export function CouponInput(): JSX.Element {
  const { appliedCouponCode, validateCoupon, isValidating, error, removeCoupon } = useCoupon();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponCodeFormValues>({ resolver: zodResolver(couponCodeSchema) });

  if (appliedCouponCode) {
    return (
      <Alert variant="success" title={`Coupon ${appliedCouponCode} applied`}>
        <button
          type="button"
          onClick={() => {
            removeCoupon();
            reset();
          }}
          className="underline"
        >
          Remove coupon
        </button>
      </Alert>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => validateCoupon(values.code))}
      className="flex items-start gap-2"
      noValidate
    >
      <div className="flex-1">
        <Input
          label="Coupon code"
          placeholder="e.g. WELCOME50"
          error={errors.code?.message ?? error ?? undefined}
          {...register('code')}
        />
      </div>
      <Button type="submit" variant="secondary" isLoading={isValidating} className="mt-6">
        Apply
      </Button>
    </form>
  );
}
