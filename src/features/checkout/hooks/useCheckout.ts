import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { queryKeys } from '@/lib/queryClient';
import { useToast } from '@/providers/ToastProvider';
import { buildPath, ROUTES } from '@/routes/routePaths';
import { useCartStore } from '@/store/cartStore';
import { parseApiError } from '@/utils/apiErrors';

import { checkoutApi } from '@/features/checkout/services/checkoutApi';
import type { CheckoutFormValues } from '@/features/checkout/schemas/checkoutSchema';

/**
 * Container hook for checkout (Section 6.2 / Section 11.7). Generates one
 * idempotency key per checkout attempt (kept in a ref so retries of the same
 * attempt reuse it — Section 11.7 "Order placement with idempotency key to
 * prevent duplicate submission") and invalidates the orders query cache on
 * success (Section 15.2 cache invalidation strategy).
 */
export function useCheckout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const cart = useCartStore((state) => state);
  const clearCart = useCartStore((state) => state.clearCart);

  const mutation = useMutation({
    mutationFn: (values: CheckoutFormValues) =>
      checkoutApi.placeOrder({
        idempotencyKey: idempotencyKeyRef.current,
        restaurantId: cart.restaurantId ?? '',
        trainNumber: cart.trainNumber ?? '',
        deliveryStation: cart.deliveryStation ?? '',
        coach: cart.coach ?? '',
        seat: cart.seat ?? '',
        items: cart.items,
        couponCode: cart.couponCode,
        paymentMode: values.paymentMode,
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      clearCart();

      if (response.razorpayOrderId) {
        navigate(ROUTES.PAYMENT, { state: { order: response.order, razorpayOrderId: response.razorpayOrderId } });
      } else {
        showToast('Order placed successfully!', 'success');
        navigate(buildPath(ROUTES.ORDER_DETAIL, { orderId: response.order.id }));
      }
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    placeOrder: mutation.mutate,
    isPlacingOrder: mutation.isPending,
    error: mutation.error ? parseApiError(mutation.error) : null,
  };
}
