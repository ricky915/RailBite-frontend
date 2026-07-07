import { memo } from 'react';
import { Link } from 'react-router-dom';

import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { buildPath, ROUTES } from '@/routes/routePaths';
import type { Restaurant } from '@/types/domain.types';
import { formatCurrency } from '@/utils/formatters';

export interface RestaurantCardProps {
  restaurant: Restaurant;
}

const STATUS_BADGE: Record<Restaurant['status'], { variant: BadgeVariant; label: string }> = {
  open: { variant: 'active', label: 'Open' },
  busy: { variant: 'pending', label: 'Busy' },
  closed: { variant: 'inactive', label: 'Closed' },
};

/**
 * Feature component: restaurant listing card (Section 6.5 Key Shared
 * Components table references this pattern; Section 11.4 listing fields).
 * Memoized — rendered in a list (Section 20.1 memoization guidance).
 */
export const RestaurantCard = memo(function RestaurantCard({ restaurant }: RestaurantCardProps): JSX.Element {
  const statusBadge = STATUS_BADGE[restaurant.status];

  return (
    <Link
      to={buildPath(ROUTES.RESTAURANT_DETAIL, { restaurantId: restaurant.id })}
      className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-neutral-900">{restaurant.name}</h3>
        <Badge variant={statusBadge.variant} label={statusBadge.label} />
      </div>

      <p className="text-sm text-neutral-500">{restaurant.cuisineTypes.join(', ')}</p>

      <div className="flex items-center gap-3 text-sm text-neutral-600">
        <span aria-label={`Rated ${restaurant.rating} out of 5`}>
          ⭐ {restaurant.rating.toFixed(1)} ({restaurant.ratingCount})
        </span>
        <span>{restaurant.estimatedDeliveryMinutes} min</span>
      </div>

      <p className="text-xs text-neutral-500">
        Min order {formatCurrency(restaurant.minOrderValueInPaise)}
      </p>

      {restaurant.isFeatured && <Badge variant="pending" label="Featured" />}
    </Link>
  );
});
