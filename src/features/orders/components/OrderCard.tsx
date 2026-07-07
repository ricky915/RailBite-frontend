import { memo } from 'react';
import { Link } from 'react-router-dom';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { buildPath, ROUTES } from '@/routes/routePaths';
import type { Order } from '@/types/domain.types';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

export interface OrderCardProps {
  order: Order;
}

const STATUS_BADGE: Record<Order['status'], BadgeVariant> = {
  PENDING_PAYMENT: 'pending',
  ORDER_PLACED: 'pending',
  ACCEPTED: 'active',
  PREPARING: 'active',
  OUT_FOR_DELIVERY: 'active',
  DELIVERED: 'active',
  CANCELLED: 'error',
  COMPLETED: 'active',
};

/** Feature component: a row in order history (Section 11.10). */
export const OrderCard = memo(function OrderCard({ order }: OrderCardProps): JSX.Element {
  return (
    <Link
      to={buildPath(ROUTES.ORDER_DETAIL, { orderId: order.id })}
      className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 hover:shadow-md"
    >
      <div>
        <p className="font-medium text-neutral-900">{order.orderId}</p>
        <p className="text-sm text-neutral-500">{order.restaurantName}</p>
        <p className="text-xs text-neutral-400">{formatDateTime(order.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Badge variant={STATUS_BADGE[order.status]} label={order.status.replace(/_/g, ' ')} />
        <p className="text-sm font-medium text-neutral-900">{formatCurrency(order.grandTotalInPaise)}</p>
      </div>
    </Link>
  );
});
