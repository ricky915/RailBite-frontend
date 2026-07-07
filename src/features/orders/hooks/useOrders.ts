import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';

import { orderApi } from '@/features/orders/services/orderApi';
import type { OrderListFilters } from '@/features/orders/types/order.types';

/** Container hook for order history (Section 6.2 / Section 11.10). */
export function useOrders(filters: OrderListFilters) {
  const query = useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => orderApi.list(filters),
    placeholderData: keepPreviousData,
  });

  return {
    orders: query.data?.items ?? [],
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
