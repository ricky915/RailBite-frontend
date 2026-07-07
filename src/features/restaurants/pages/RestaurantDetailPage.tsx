import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { Alert } from '@/components/feedback/Alert';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/providers/ToastProvider';
import { useCartStore } from '@/store/cartStore';
import { parseApiError } from '@/utils/apiErrors';
import type { MenuItem } from '@/types/domain.types';

import { MenuItemCard } from '@/features/restaurants/components/MenuItemCard';
import { useRestaurantDetail } from '@/features/restaurants/hooks/useRestaurantDetail';
import { useRestaurantMenu } from '@/features/restaurants/hooks/useRestaurantMenu';

/**
 * Page component: restaurant detail + menu (Section 11.4 / 11.5). Enforces
 * the single-restaurant-per-cart rule (Section 11.6) by prompting to start a
 * new cart when the user adds an item from a different restaurant.
 */
export default function RestaurantDetailPage(): JSX.Element {
  const { restaurantId = '' } = useParams<{ restaurantId: string }>();
  const { showToast } = useToast();
  const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);

  const { restaurant, isLoading: isRestaurantLoading, isError, error } = useRestaurantDetail(restaurantId);
  const { categories, isLoading: isMenuLoading } = useRestaurantMenu(restaurantId);

  const cartRestaurantId = useCartStore((state) => state.restaurantId);
  const addItem = useCartStore((state) => state.addItem);
  const startNewCartForRestaurant = useCartStore((state) => state.startNewCartForRestaurant);

  const addToCart = (item: MenuItem): void => {
    const cartItem = {
      menuItemId: item.id,
      name: item.name,
      priceInPaise: item.priceInPaise,
      quantity: 1,
      customizations: [],
      specialNote: null,
    };

    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      setPendingItem(item);
      return;
    }

    if (!cartRestaurantId && restaurant) {
      startNewCartForRestaurant(restaurant.id, restaurant.name, cartItem);
    } else {
      addItem(cartItem);
    }
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const confirmSwitchRestaurant = (): void => {
    if (!pendingItem || !restaurant) return;
    startNewCartForRestaurant(restaurant.id, restaurant.name, {
      menuItemId: pendingItem.id,
      name: pendingItem.name,
      priceInPaise: pendingItem.priceInPaise,
      quantity: 1,
      customizations: [],
      specialNote: null,
    });
    showToast(`Started a new cart for ${restaurant.name}`, 'success');
    setPendingItem(null);
  };

  if (isError) {
    return <Alert variant="error">{parseApiError(error)}</Alert>;
  }

  if (isRestaurantLoading || !restaurant) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton height={120} className="rounded-xl" />
        <Skeleton height={400} className="rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{restaurant.name} — RailBite</title>
        <meta name="description" content={`Order from ${restaurant.name} — ${restaurant.cuisineTypes.join(', ')}.`} />
        <meta property="og:title" content={`${restaurant.name} — RailBite`} />
        <meta property="og:type" content="restaurant.menu" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: restaurant.name,
            servesCuisine: restaurant.cuisineTypes,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: restaurant.rating,
              reviewCount: restaurant.ratingCount,
            },
          })}
        </script>
      </Helmet>

      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-neutral-900">{restaurant.name}</h1>
          <p className="text-sm text-neutral-500">{restaurant.cuisineTypes.join(', ')}</p>
        </header>

        {isMenuLoading ? (
          <Skeleton height={300} className="rounded-xl" />
        ) : categories.length === 0 ? (
          <EmptyState title="Menu unavailable" description="This restaurant hasn't published a menu yet." />
        ) : (
          categories.map((category) => (
            <section key={category.id}>
              <h2 className="mb-2 text-lg font-semibold text-neutral-900">{category.name}</h2>
              <div className="rounded-xl border border-neutral-200 bg-white px-4">
                {category.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(pendingItem)}
        title="Start a new cart?"
        message="Your cart has items from another restaurant. Adding this item will clear your existing cart."
        confirmLabel="Start new cart"
        onConfirm={confirmSwitchRestaurant}
        onCancel={() => setPendingItem(null)}
      />
    </>
  );
}
