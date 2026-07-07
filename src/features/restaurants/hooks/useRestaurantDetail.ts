import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';

import { restaurantApi } from '@/features/restaurants/services/restaurantApi';

/** Container hook for the restaurant detail page header (Section 6.2). */
export function useRestaurantDetail(restaurantId: string) {
  const query = useQuery({
    queryKey: queryKeys.restaurants.detail(restaurantId),
    queryFn: () => restaurantApi.getById(restaurantId),
    enabled: Boolean(restaurantId),
  });

  return {
    restaurant: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
