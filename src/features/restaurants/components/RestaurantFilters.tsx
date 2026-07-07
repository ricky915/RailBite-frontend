import type { ChangeEvent } from 'react';

import type { RestaurantListFilters } from '@/features/restaurants/types/restaurant.types';

export interface RestaurantFiltersProps {
  filters: RestaurantListFilters;
  onChange: (filters: RestaurantListFilters) => void;
}

const SORT_OPTIONS: Array<{ value: NonNullable<RestaurantListFilters['sortBy']>; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Rating' },
  { value: 'deliveryTime', label: 'Delivery time' },
  { value: 'price', label: 'Price' },
];

/**
 * Feature component: restaurant listing filter bar (Section 11.4 — filter by
 * cuisine, veg-only, rating; sort by relevance/rating/deliveryTime/price).
 * Filter state is owned by the URL (Section 8.7), so this component is a
 * thin controlled view over the `filters` prop.
 */
export function RestaurantFilters({ filters, onChange }: RestaurantFiltersProps): JSX.Element {
  const handleVegOnlyChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...filters, vegOnly: event.target.checked });
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange({ ...filters, sortBy: event.target.value as RestaurantListFilters['sortBy'] });
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange({ ...filters, search: event.target.value });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <input
        type="search"
        placeholder="Search restaurants or cuisine"
        value={filters.search ?? ''}
        onChange={handleSearchChange}
        aria-label="Search restaurants"
        className="h-10 min-w-48 flex-1 rounded-lg border border-neutral-300 px-3 text-sm"
      />

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" checked={filters.vegOnly ?? false} onChange={handleVegOnlyChange} />
        Veg only
      </label>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        Sort by
        <select
          value={filters.sortBy ?? 'relevance'}
          onChange={handleSortChange}
          className="h-9 rounded-lg border border-neutral-300 px-2 text-sm"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
