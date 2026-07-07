import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';
import type { Invoice } from '@/types/domain.types';

/** Axios calls for the invoices feature (Section 11.4 `GET /api/v1/invoices/:orderId`). */
export const invoiceApi = {
  getByOrderId: async (orderId: string): Promise<Invoice> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Invoice>>(`/invoices/${orderId}`);
    return data.data;
  },
};
