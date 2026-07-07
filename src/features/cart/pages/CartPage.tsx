import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import { PriceBreakdown } from '@/components/ui/PriceBreakdown';
import { ROUTES } from '@/routes/routePaths';
import { useCartStore } from '@/store/cartStore';

import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { useCart } from '@/features/cart/hooks/useCart';
import {
  deliveryDetailsSchema,
  type DeliveryDetailsFormValues,
} from '@/features/cart/schemas/deliveryDetailsSchema';

/**
 * Page component: cart (Section 11.6 Cart Module). Collects coach/seat
 * (Section 10.5 step 5) and hands off to checkout once the cart is non-empty
 * and delivery details are valid.
 */
export default function CartPage(): JSX.Element {
  const navigate = useNavigate();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const { items, restaurantName, subtotalInPaise, updateQuantity, removeItem, clearCart } = useCart();
  const setDeliveryDetails = useCartStore((state) => state.setDeliveryDetails);
  const deliveryStation = useCartStore((state) => state.deliveryStation);
  const trainNumber = useCartStore((state) => state.trainNumber);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DeliveryDetailsFormValues>({
    resolver: zodResolver(deliveryDetailsSchema),
    mode: 'onBlur',
  });

  const proceedToCheckout = (values: DeliveryDetailsFormValues): void => {
    setDeliveryDetails({
      deliveryStation: deliveryStation ?? '',
      trainNumber: trainNumber ?? '',
      coach: values.coach,
      seat: values.seat,
    });
    navigate(ROUTES.CHECKOUT);
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse restaurants at your delivery station to add items."
        action={
          <Link to={ROUTES.RESTAURANTS}>
            <Button>Browse restaurants</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Your cart — RailBite</title>
      </Helmet>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {restaurantName && <p className="mb-2 text-sm text-neutral-500">Ordering from {restaurantName}</p>}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            {items.map((item) => (
              <CartItemRow key={item.menuItemId} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsClearConfirmOpen(true)}
              className="text-sm text-danger-700 hover:underline"
            >
              Clear cart
            </button>
            <Link to={ROUTES.COUPONS} className="text-sm text-brand-600 hover:underline">
              Have a coupon?
            </Link>
          </div>

          <form
            onSubmit={handleSubmit(proceedToCheckout)}
            className="mt-6 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4"
            noValidate
          >
            <h2 className="font-semibold text-neutral-900">Delivery details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Coach (e.g. S2)" error={errors.coach?.message} {...register('coach')} />
              <Input label="Seat number" error={errors.seat?.message} {...register('seat')} />
            </div>
            <Button type="submit" disabled={!isValid}>
              Proceed to checkout
            </Button>
          </form>
        </div>

        <div>
          <PriceBreakdown breakdown={{ subtotalInPaise, grandTotalInPaise: subtotalInPaise }} />
        </div>
      </div>

      <ConfirmModal
        isOpen={isClearConfirmOpen}
        title="Clear cart?"
        message="This removes all items from your cart. This cannot be undone."
        confirmLabel="Clear cart"
        isDangerous
        onConfirm={() => {
          clearCart();
          setIsClearConfirmOpen(false);
        }}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </>
  );
}
