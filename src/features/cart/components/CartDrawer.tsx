import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ROUTES } from '@/routes/routePaths';
import { formatCurrency } from '@/utils/formatters';

import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { useCart } from '@/features/cart/hooks/useCart';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-over cart preview (Section 10.5 step 2 — "Add item to cart → update
 * cart badge; show cart drawer"). A lighter-weight sibling of `<Modal />`
 * (right-anchored panel rather than a centered dialog) sharing the same
 * Escape-to-close / backdrop-click accessibility behavior.
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps): JSX.Element | null {
  const navigate = useNavigate();
  const { items, restaurantName, subtotalInPaise, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className="relative z-10 flex h-full w-full max-w-sm flex-col bg-white p-4 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Your cart</h2>
          <button type="button" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState title="Your cart is empty" description="Add items from a restaurant to get started." />
        ) : (
          <>
            {restaurantName && <p className="mb-2 text-sm text-neutral-500">From {restaurantName}</p>}
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <CartItemRow
                  key={item.menuItemId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between font-medium text-neutral-900">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotalInPaise)}</span>
            </div>
            <Button
              className="mt-4"
              onClick={() => {
                onClose();
                navigate(ROUTES.CART);
              }}
            >
              View cart
            </Button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
