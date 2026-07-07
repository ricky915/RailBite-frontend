import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { ORDERS_PAGE_SIZE } from '@/config/constants';
import { usePagination } from '@/hooks/usePagination';

import { OrderCard } from '@/features/orders/components/OrderCard';
import { useOrders } from '@/features/orders/hooks/useOrders';
import type { OrderListFilters } from '@/features/orders/types/order.types';

/** Page component: order history (Section 11.10 Order Management Module). */
export default function OrdersListPage(): JSX.Element {
  const { page, setPage } = usePagination(ORDERS_PAGE_SIZE);

  const filters = useMemo<OrderListFilters>(
    () => ({ page, pageSize: ORDERS_PAGE_SIZE }),
    [page],
  );

  const { orders, totalPages, isLoading } = useOrders(filters);

  return (
    <>
      <Helmet>
        <title>Your orders — RailBite</title>
      </Helmet>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-neutral-900">Your orders</h1>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} height={80} className="rounded-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState title="No orders yet" description="Your placed orders will show up here." />
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
