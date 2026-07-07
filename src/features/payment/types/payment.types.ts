import type { Order } from '@/types/domain.types';

export interface PaymentPageState {
  order: Order;
  razorpayOrderId: string;
}
