import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';
import { useToast } from '@/providers/ToastProvider';
import { parseApiError } from '@/utils/apiErrors';

import { orderApi } from '@/features/orders/services/orderApi';

/**
 * Container hook for order detail + cancellation (Section 6.2 / Section
 * 11.10). Cancellation invalidates both the detail and list caches
 * (Section 15.2 cache invalidation strategy).
 */
export function useOrderDetail(orderId: string) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const query = useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderApi.getById(orderId),
    enabled: Boolean(orderId),
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => orderApi.cancel(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      showToast('Order cancelled.', 'success');
    },
    onError: (error) => {
      showToast(parseApiError(error), 'error');
    },
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ? parseApiError(query.error) : null,
    cancelOrder: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
}
