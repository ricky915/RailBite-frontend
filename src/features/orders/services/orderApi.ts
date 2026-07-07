import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope, PaginatedData } from '@/types/api.types';
import type { Order } from '@/types/domain.types';

import type { OrderListFilters } from '@/features/orders/types/order.types';
import { generateQueryString } from '@/utils/queryBuilder';

/**
 * Axios calls for the orders feature (Section 11.4: `GET /api/v1/orders`,
 * `GET /api/v1/orders/:id`, `POST /api/v1/orders/:id/cancel`).
 */
export const orderApi = {
  list: async (filters: OrderListFilters): Promise<{ items: Order[]; totalPages: number }> => {
    const queryString = generateQueryString(filters);
    const { data } = await apiClient.get<ApiSuccessEnvelope<PaginatedData<Order>>>(
      `/orders${queryString}`,
    );
    return { items: data.data.items, totalPages: data.meta?.totalPages ?? 1 };
  },

  getById: async (orderId: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Order>>(`/orders/${orderId}`);
    return data.data;
  },

  cancel: async (orderId: string, reason: string): Promise<Order> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Order>>(`/orders/${orderId}/cancel`, {
      reason,
    });
    return data.data;
  },
};
