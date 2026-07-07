import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/routes/routePaths';

import { usePayment } from '@/features/payment/hooks/usePayment';
import type { PaymentPageState } from '@/features/payment/types/payment.types';

/**
 * Page component: payment (Section 11.8 Payment Module). Expects
 * `{ order, razorpayOrderId }` in router state, set by the checkout flow
 * after `POST /api/v1/orders` succeeds with `paymentMode: 'online'`.
 */
export default function PaymentPage(): JSX.Element {
  const location = useLocation();
  const state = location.state as PaymentPageState | null;

  if (!state?.order || !state.razorpayOrderId) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const { openCheckout, isPolling, hasTimedOut, formattedAmount } = usePayment(
    state.order,
    state.razorpayOrderId,
  );

  return (
    <>
      <Helmet>
        <title>Payment — RailBite</title>
      </Helmet>

      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Complete your payment</h1>
        <p className="text-neutral-600">
          Order {state.order.orderId} · {formattedAmount}
        </p>

        {hasTimedOut && (
          <Alert variant="warning">
            We&apos;re still confirming your payment. If your bank has debited the amount, it will
            reflect shortly — check Order History or contact support if it doesn&apos;t within a few
            minutes.
          </Alert>
        )}

        <Button onClick={openCheckout} isLoading={isPolling} disabled={isPolling}>
          {isPolling ? 'Waiting for confirmation…' : `Pay ${formattedAmount}`}
        </Button>
      </div>
    </>
  );
}
