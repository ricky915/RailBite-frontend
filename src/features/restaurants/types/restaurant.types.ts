import type { ListQueryParams } from '@/types/api.types';

/** Filter/sort params for the restaurant listing endpoint (Section 11.4 Restaurant Listing Module). */
export interface RestaurantListFilters extends ListQueryParams {
  stationCode?: string;
  cuisine?: string;
  vegOnly?: boolean;
  minRating?: number;
  sortBy?: 'relevance' | 'rating' | 'deliveryTime' | 'price';
}
