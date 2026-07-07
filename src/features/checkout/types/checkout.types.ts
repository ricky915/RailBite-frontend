import type { CartItem, Order, PaymentMode } from '@/types/domain.types';

/** Order placement payload (Section 11.4 `POST /api/v1/orders`; Section 11.7). */
export interface PlaceOrderPayload {
  idempotencyKey: string;
  restaurantId: string;
  trainNumber: string;
  deliveryStation: string;
  coach: string;
  seat: string;
  items: CartItem[];
  couponCode: string | null;
  paymentMode: PaymentMode;
}

export interface PlaceOrderResponse {
  order: Order;
  /** Present only when paymentMode is 'online' — used to open Razorpay checkout. */
  razorpayOrderId?: string;
}
