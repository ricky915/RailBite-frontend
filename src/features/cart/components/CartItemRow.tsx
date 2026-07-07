import { memo } from 'react';

import { Button } from '@/components/ui/Button';
import { MAX_CART_QUANTITY_PER_ITEM, MIN_CART_QUANTITY_PER_ITEM } from '@/config/constants';
import type { CartItem } from '@/types/domain.types';
import { formatCurrency } from '@/utils/formatters';

export interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
}

/**
 * Feature component: itemized cart row (Section 11.6 — item name,
 * customizations, unit price, quantity, subtotal).
 */
export const CartItemRow = memo(function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps): JSX.Element {
  const customizationTotal = item.customizations.reduce(
    (sum, customization) => sum + customization.additionalChargeInPaise,
    0,
  );
  const lineTotal = (item.priceInPaise + customizationTotal) * item.quantity;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-neutral-900">{item.name}</p>
        {item.customizations.length > 0 && (
          <p className="text-xs text-neutral-500">
            {item.customizations.map((customization) => customization.value).join(', ')}
          </p>
        )}
        {item.specialNote && <p className="text-xs italic text-neutral-500">"{item.specialNote}"</p>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease quantity of ${item.name}`}
          disabled={item.quantity <= MIN_CART_QUANTITY_PER_ITEM}
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity - 1)}
          className="h-7 w-7 rounded-full border border-neutral-300 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{item.quantity}</span>
        <button
          type="button"
          aria-label={`Increase quantity of ${item.name}`}
          disabled={item.quantity >= MAX_CART_QUANTITY_PER_ITEM}
          onClick={() => onUpdateQuantity(item.menuItemId, item.quantity + 1)}
          className="h-7 w-7 rounded-full border border-neutral-300 disabled:opacity-40"
        >
          +
        </button>
      </div>

      <p className="w-20 text-right text-sm font-medium text-neutral-900">{formatCurrency(lineTotal)}</p>

      <Button variant="ghost" size="sm" onClick={() => onRemove(item.menuItemId)}>
        Remove
      </Button>
    </div>
  );
});
