import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import { EmptyState } from '@/components/feedback/EmptyState';
import { Alert } from '@/components/feedback/Alert';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { RESTAURANTS_PAGE_SIZE } from '@/config/constants';
import { usePagination } from '@/hooks/usePagination';
import { parseApiError } from '@/utils/apiErrors';

import { RestaurantCard } from '@/features/restaurants/components/RestaurantCard';
import { RestaurantFilters } from '@/features/restaurants/components/RestaurantFilters';
import { useRestaurants } from '@/features/restaurants/hooks/useRestaurants';
import type { RestaurantListFilters } from '@/features/restaurants/types/restaurant.types';

/**
 * Page component: restaurant listing (Section 11.4 Restaurant Listing
 * Module). Filters/sort/pagination live in the URL (Section 8.7), so the
 * page reads/writes `useSearchParams` and delegates data fetching to the
 * `useRestaurants` container hook.
 */
export default function RestaurantListingPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, setPage } = usePagination(RESTAURANTS_PAGE_SIZE);

  const filters = useMemo<RestaurantListFilters>(
    () => ({
      page,
      pageSize: RESTAURANTS_PAGE_SIZE,
      search: searchParams.get('search') ?? undefined,
      vegOnly: searchParams.get('vegOnly') === 'true' || undefined,
      sortBy: (searchParams.get('sortBy') as RestaurantListFilters['sortBy']) ?? 'relevance',
    }),
    [page, searchParams],
  );

  const { restaurants, totalPages, isLoading, isError, error, refetch } = useRestaurants(filters);

  const handleFiltersChange = (nextFilters: RestaurantListFilters): void => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (nextFilters.search) next.set('search', nextFilters.search);
      else next.delete('search');
      if (nextFilters.vegOnly) next.set('vegOnly', 'true');
      else next.delete('vegOnly');
      if (nextFilters.sortBy) next.set('sortBy', nextFilters.sortBy);
      next.set('page', '1');
      return next;
    });
  };

  return (
    <>
      <Helmet>
        <title>Restaurants — RailBite</title>
        <meta
          name="description"
          content="Browse restaurants available for delivery to your train seat, filtered by station and delivery window."
        />
      </Helmet>

      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-neutral-900">Restaurants near your delivery station</h1>

        <RestaurantFilters filters={filters} onChange={handleFiltersChange} />

        {isError && (
          <Alert variant="error">
            {parseApiError(error)}{' '}
            <button type="button" onClick={() => refetch()} className="underline">
              Retry
            </button>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: RESTAURANTS_PAGE_SIZE }, (_, index) => (
              <Skeleton key={index} height={160} className="rounded-xl" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <EmptyState
            title="No restaurants available yet"
            description="Try a different delivery station, or check back closer to your journey time."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
