import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/providers/ToastProvider';
import { selectCartSubtotalInPaise, useCartStore } from '@/store/cartStore';
import { parseApiError } from '@/utils/apiErrors';

import { couponApi } from '@/features/coupons/services/couponApi';

/**
 * Container hook for applying/removing a coupon (Section 6.2 / Section
 * 11.9 Coupon Module). Coupon state itself lives in the Zustand cart store
 * (Section 15.2 — "Apply Coupon: Zustand store; server validates at checkout"),
 * this hook only owns the server round-trip that validates a code before
 * writing it to the store.
 */
export function useCoupon() {
  const { showToast } = useToast();
  const restaurantId = useCartStore((state) => state.restaurantId);
  const subtotalInPaise = useCartStore(selectCartSubtotalInPaise);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const couponCode = useCartStore((state) => state.couponCode);

  const mutation = useMutation({
    mutationFn: (code: string) =>
      couponApi.validate({
        code,
        cartSubtotalInPaise: subtotalInPaise,
        restaurantId: restaurantId ?? '',
      }),
    onSuccess: (result) => {
      applyCoupon(result.coupon.code, result.discountInPaise);
      showToast(`Coupon ${result.coupon.code} applied!`, 'success');
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    appliedCouponCode: couponCode,
    validateCoupon: mutation.mutate,
    isValidating: mutation.isPending,
    error: mutation.error ? parseApiError(mutation.error) : null,
    removeCoupon,
  };
}
