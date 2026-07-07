import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';
import type { Order } from '@/types/domain.types';

/**
 * Axios calls for the payment feature. Razorpay success/failure is
 * confirmed server-side via webhook (Section 11.4 `POST /api/v1/payments/webhook`,
 * signature-verified — never callable from the browser), so the frontend's
 * only job after opening Razorpay checkout is to poll the order status
 * (Section 11.8 — "Payment status polling with 30-second timeout") using the
 * same `GET /api/v1/orders/:id` endpoint the orders feature exposes.
 */
export const paymentApi = {
  getOrderStatus: async (orderId: string): Promise<Order> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Order>>(`/orders/${orderId}`);
    return data.data;
  },
};
