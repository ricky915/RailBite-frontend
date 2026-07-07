import { memo } from 'react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { MenuItem } from '@/types/domain.types';
import { formatCurrency } from '@/utils/formatters';

export interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

/**
 * Feature component: a single menu item row (Section 11.5 Menu Module).
 * Out-of-stock items remain visible but non-orderable (Section 11.5
 * business rule) rather than being hidden.
 */
export const MenuItemCard = memo(function MenuItemCard({ item, onAddToCart }: MenuItemCardProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-4 last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span
            aria-label={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
            className={`inline-block h-3 w-3 border ${item.isVeg ? 'border-success-500' : 'border-danger-500'}`}
          >
            <span
              className={`m-auto block h-1.5 w-1.5 rounded-full ${item.isVeg ? 'bg-success-500' : 'bg-danger-500'}`}
            />
          </span>
          <h4 className="font-medium text-neutral-900">{item.name}</h4>
          {!item.isAvailable && <Badge variant="inactive" label="Currently unavailable" />}
        </div>
        <p className="text-sm text-neutral-500">{item.description}</p>
        <p className="mt-1 text-sm font-medium text-neutral-900">{formatCurrency(item.priceInPaise)}</p>
      </div>

      <Button
        size="sm"
        variant="secondary"
        disabled={!item.isAvailable}
        onClick={() => onAddToCart(item)}
      >
        Add
      </Button>
    </div>
  );
});
