import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';

import { restaurantApi } from '@/features/restaurants/services/restaurantApi';
import type { RestaurantListFilters } from '@/features/restaurants/types/restaurant.types';

/**
 * Container hook for the restaurant listing page (Section 6.2 / Section 8.4
 * query key factory). Uses `keepPreviousData` so pagination/filter changes
 * don't flash a loading state over existing results (Section 8.8).
 */
export function useRestaurants(filters: RestaurantListFilters) {
  const query = useQuery({
    queryKey: queryKeys.restaurants.list(filters),
    queryFn: () => restaurantApi.list(filters),
    placeholderData: keepPreviousData,
  });

  return {
    restaurants: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
