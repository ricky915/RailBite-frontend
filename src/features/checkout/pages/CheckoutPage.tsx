import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/routes/routePaths';
import { selectCartSubtotalInPaise, useCartStore } from '@/store/cartStore';

import { OrderSummary } from '@/features/checkout/components/OrderSummary';
import { checkoutSchema, type CheckoutFormValues } from '@/features/checkout/schemas/checkoutSchema';
import { useCheckout } from '@/features/checkout/hooks/useCheckout';

/**
 * Page component: checkout (Section 11.7 Checkout Module). Re-validates the
 * cart against server state before allowing payment (delegated to
 * `useCheckout`, which calls `POST /api/v1/orders`) and requires the terms
 * acknowledgment checkbox to be checked (Section 11.7 business rules).
 *
 * NOTE: the < 45-minute delivery window re-check (Section 11.7 edge case)
 * depends on live train schedule data from `features/search`, which is out
 * of scope for this scaffold's reference flow — the server is the source of
 * truth for that check and will reject the order if the window has closed.
 */
export default function CheckoutPage(): JSX.Element {
  const items = useCartStore((state) => state.items);
  const deliveryStation = useCartStore((state) => state.deliveryStation);
  const trainNumber = useCartStore((state) => state.trainNumber);
  const coach = useCartStore((state) => state.coach);
  const seat = useCartStore((state) => state.seat);
  const couponDiscount = useCartStore((state) => state.couponDiscount);
  const subtotalInPaise = useCartStore(selectCartSubtotalInPaise);

  const { placeOrder, isPlacingOrder, error } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMode: 'online', acceptedTerms: false },
    mode: 'onChange',
  });

  if (items.length === 0) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const grandTotalInPaise = Math.max(subtotalInPaise - couponDiscount, 0);

  return (
    <>
      <Helmet>
        <title>Checkout — RailBite</title>
      </Helmet>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-2xl font-bold text-neutral-900">Checkout</h1>

          {error && <Alert variant="error">{error}</Alert>}

          <form onSubmit={handleSubmit((values) => placeOrder(values))} className="flex flex-col gap-4" noValidate>
            <fieldset className="rounded-xl border border-neutral-200 bg-white p-4">
              <legend className="px-1 text-sm font-semibold text-neutral-900">Payment method</legend>
              <label className="flex items-center gap-2 py-1 text-sm text-neutral-700">
                <input type="radio" value="online" {...register('paymentMode')} />
                Pay online (UPI / Card / Netbanking / Wallet)
              </label>
              <label className="flex items-center gap-2 py-1 text-sm text-neutral-700">
                <input type="radio" value="cod" {...register('paymentMode')} />
                Cash on Delivery
              </label>
            </fieldset>

            <label className="flex items-start gap-2 text-sm text-neutral-700">
              <input type="checkbox" className="mt-1" {...register('acceptedTerms')} />
              <span>
                I agree to the RailBite Terms of Service and Cancellation Policy.
                {errors.acceptedTerms && (
                  <span className="block text-danger-700">{errors.acceptedTerms.message}</span>
                )}
              </span>
            </label>

            <Button type="submit" isLoading={isPlacingOrder} disabled={!isValid || isPlacingOrder}>
              Place order
            </Button>
          </form>
        </div>

        <OrderSummary
          items={items}
          deliveryStation={deliveryStation}
          trainNumber={trainNumber}
          coach={coach}
          seat={seat}
          breakdown={{
            subtotalInPaise,
            couponDiscountInPaise: couponDiscount || undefined,
            grandTotalInPaise,
          }}
        />
      </div>
    </>
  );
}
