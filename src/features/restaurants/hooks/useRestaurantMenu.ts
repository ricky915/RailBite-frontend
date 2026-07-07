import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryClient';

import { restaurantApi } from '@/features/restaurants/services/restaurantApi';

const MENU_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // Section 11.5: refresh at least every 5 minutes

/** Container hook for the restaurant menu (Section 6.2 / Section 11.5). */
export function useRestaurantMenu(restaurantId: string) {
  const query = useQuery({
    queryKey: queryKeys.restaurants.menu(restaurantId),
    queryFn: () => restaurantApi.getMenu(restaurantId),
    enabled: Boolean(restaurantId),
    refetchInterval: MENU_REFRESH_INTERVAL_MS,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
