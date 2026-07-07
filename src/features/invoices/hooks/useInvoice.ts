import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';

import { invoiceApi } from '@/features/invoices/services/invoiceApi';

/** Container hook for invoice download (Section 6.2 / Section 11.13 Invoice Module). */
export function useInvoice(orderId: string) {
  const query = useQuery({
    queryKey: queryKeys.invoices.byOrder(orderId),
    queryFn: () => invoiceApi.getByOrderId(orderId),
    enabled: Boolean(orderId),
  });

  return {
    invoice: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
