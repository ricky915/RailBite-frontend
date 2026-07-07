import { useMutation } from '@tanstack/react-query';

import { cartApi } from '@/features/cart/services/cartApi';
import { selectCartItemCount, selectCartSubtotalInPaise, useCartStore } from '@/store/cartStore';
import { parseApiError } from '@/utils/apiErrors';

/**
 * Container hook for the cart (Section 6.2). Cart mutations (add/remove/
 * update quantity) are Zustand-only — no server state involved (Section
 * 15.2) — so this hook mostly re-exposes store selectors/actions, plus the
 * one server round-trip the cart feature owns: pre-checkout validation
 * (Section 11.6 — "All prices in the cart must be validated against
 * server-side prices at checkout submission").
 */
export function useCart() {
  const items = useCartStore((state) => state.items);
  const restaurantId = useCartStore((state) => state.restaurantId);
  const restaurantName = useCartStore((state) => state.restaurantName);
  const couponCode = useCartStore((state) => state.couponCode);
  const couponDiscount = useCartStore((state) => state.couponDiscount);
  const subtotalInPaise = useCartStore(selectCartSubtotalInPaise);
  const itemCount = useCartStore(selectCartItemCount);

  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const validation = useMutation({
    mutationFn: () =>
      cartApi.validate({
        restaurantId: restaurantId ?? '',
        items,
        couponCode,
      }),
  });

  return {
    items,
    restaurantId,
    restaurantName,
    couponCode,
    couponDiscount,
    subtotalInPaise,
    itemCount,
    removeItem,
    updateQuantity,
    clearCart,
    removeCoupon,
    validateCart: validation.mutate,
    isValidating: validation.isPending,
    validationResult: validation.data,
    validationError: validation.error ? parseApiError(validation.error) : null,
  };
}
