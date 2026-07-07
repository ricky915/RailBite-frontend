import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope, PaginatedData } from '@/types/api.types';
import type { MenuCategory, Restaurant } from '@/types/domain.types';

import type { RestaurantListFilters } from '@/features/restaurants/types/restaurant.types';
import { generateQueryString } from '@/utils/queryBuilder';

/**
 * Axios calls for the restaurants feature (Section 11.4 endpoint table).
 * Covers listing, detail, and menu — the TRD folder tree groups all three
 * under `features/restaurants` (Section 4.1: "Restaurant listing, detail, menu").
 */
export const restaurantApi = {
  list: async (
    filters: RestaurantListFilters,
  ): Promise<{ items: Restaurant[]; total: number; totalPages: number }> => {
    const queryString = generateQueryString(filters);
    const { data } = await apiClient.get<ApiSuccessEnvelope<PaginatedData<Restaurant>>>(
      `/restaurants${queryString}`,
    );
    return {
      items: data.data.items,
      total: data.meta?.total ?? data.data.items.length,
      totalPages: data.meta?.totalPages ?? 1,
    };
  },

  getById: async (id: string): Promise<Restaurant> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Restaurant>>(`/restaurants/${id}`);
    return data.data;
  },

  getMenu: async (id: string): Promise<MenuCategory[]> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<MenuCategory[]>>(
      `/restaurants/${id}/menu`,
    );
    return data.data;
  },
};
