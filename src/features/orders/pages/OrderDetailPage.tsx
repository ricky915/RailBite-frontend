import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PriceBreakdown } from '@/components/ui/PriceBreakdown';
import { Skeleton } from '@/components/ui/Skeleton';
import { buildPath, ROUTES } from '@/routes/routePaths';
import { formatDateTime } from '@/utils/formatters';

import { OrderTimeline } from '@/features/orders/components/OrderTimeline';
import { useOrderDetail } from '@/features/orders/hooks/useOrderDetail';

const CANCELLABLE_STATUSES = new Set(['ORDER_PLACED', 'ACCEPTED']);

/** Page component: order detail (Section 11.10 — timeline, cancel, invoice link). */
export default function OrderDetailPage(): JSX.Element {
  const { orderId = '' } = useParams<{ orderId: string }>();
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const { order, isLoading, isError, error, cancelOrder, isCancelling } = useOrderDetail(orderId);

  if (isError) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (isLoading || !order) {
    return <Skeleton height={400} className="rounded-xl" />;
  }

  const canCancel = CANCELLABLE_STATUSES.has(order.status);

  return (
    <>
      <Helmet>
        <title>Order {order.orderId} — RailBite</title>
      </Helmet>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-neutral-900">{order.orderId}</h1>
          <p className="mb-4 text-sm text-neutral-500">
            {order.restaurantName} · Placed {formatDateTime(order.createdAt)}
          </p>

          <OrderTimeline history={order.statusHistory} />

          <div className="mt-6 flex flex-wrap gap-3">
            {canCancel && (
              <Button variant="danger" onClick={() => setIsCancelConfirmOpen(true)} disabled={isCancelling}>
                Cancel order
              </Button>
            )}
            {order.status === 'DELIVERED' && (
              <Link to={buildPath(ROUTES.RATE_ORDER, { orderId: order.id })}>
                <Button variant="secondary">Rate this order</Button>
              </Link>
            )}
            {order.status === 'COMPLETED' && (
              <Link to={buildPath(ROUTES.INVOICE_DETAIL, { orderId: order.id })}>
                <Button variant="secondary">View invoice</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
            <h3 className="mb-2 font-semibold text-neutral-900">Delivery details</h3>
            <p>Train {order.trainNumber}</p>
            <p>{order.deliveryStation}</p>
            <p>
              Coach {order.coach} · Seat {order.seat}
            </p>
          </div>

          <PriceBreakdown
            breakdown={{
              subtotalInPaise: order.subtotalInPaise,
              deliveryFeeInPaise: order.deliveryFeeInPaise,
              platformFeeInPaise: order.platformFeeInPaise,
              gstAmountInPaise: order.gstAmountInPaise,
              couponDiscountInPaise: order.couponDiscountInPaise || undefined,
              grandTotalInPaise: order.grandTotalInPaise,
            }}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isCancelConfirmOpen}
        title="Cancel this order?"
        message="Refund eligibility depends on how far your order has progressed (Section 12 Cancellation Policy)."
        confirmLabel="Cancel order"
        isDangerous
        isConfirming={isCancelling}
        onConfirm={() => {
          cancelOrder('Cancelled by passenger');
          setIsCancelConfirmOpen(false);
        }}
        onCancel={() => setIsCancelConfirmOpen(false)}
      />
    </>
  );
}
