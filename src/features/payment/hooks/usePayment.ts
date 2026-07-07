import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { env } from '@/config/env';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { useToast } from '@/providers/ToastProvider';
import { buildPath, ROUTES } from '@/routes/routePaths';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/formatters';
import type { Order } from '@/types/domain.types';

import { paymentApi } from '@/features/payment/services/paymentApi';

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 30000; // Section 11.8: 30-second polling timeout

/**
 * Container hook for the payment page (Section 6.2 / Section 11.8 Payment
 * Module). Opens the Razorpay checkout modal, then polls order status until
 * the webhook-driven payment confirmation lands or the 30s timeout elapses.
 */
export function usePayment(order: Order, razorpayOrderId: string) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useAuthStore((state) => state.user);
  const [isPolling, setIsPolling] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const statusQuery = useQuery({
    queryKey: ['payment', 'status', order.id],
    queryFn: () => paymentApi.getOrderStatus(order.id),
    enabled: isPolling,
    refetchInterval: (query) =>
      query.state.data?.paymentStatus === 'captured' ? false : POLL_INTERVAL_MS,
  });

  useEffect(() => {
    if (!isPolling) return;
    const timeoutId = setTimeout(() => setHasTimedOut(true), POLL_TIMEOUT_MS);
    return () => clearTimeout(timeoutId);
  }, [isPolling]);

  useEffect(() => {
    if (statusQuery.data?.paymentStatus === 'captured') {
      setIsPolling(false);
      showToast('Payment successful! Your order is confirmed.', 'success');
      navigate(buildPath(ROUTES.ORDER_DETAIL, { orderId: order.id }), { replace: true });
    }
  }, [statusQuery.data, navigate, order.id, showToast]);

  const openCheckout = async (): Promise<void> => {
    try {
      await openRazorpayCheckout({
        key: env.VITE_RAZORPAY_KEY_ID,
        amount: order.grandTotalInPaise,
        currency: 'INR',
        name: 'RailBite',
        description: `Order ${order.orderId}`,
        order_id: razorpayOrderId,
        prefill: { name: user?.name, email: user?.email, contact: user?.mobile },
        theme: { color: '#ea580c' },
        handler: () => setIsPolling(true),
        modal: {
          ondismiss: () => showToast('Payment was not completed.', 'warning'),
        },
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to start payment.', 'error');
    }
  };

  return {
    openCheckout,
    isPolling,
    hasTimedOut,
    formattedAmount: formatCurrency(order.grandTotalInPaise),
  };
}
