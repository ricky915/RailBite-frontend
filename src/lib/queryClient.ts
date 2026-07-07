import { QueryClient } from '@tanstack/react-query';

import type { ListQueryParams } from '@/types/api.types';

/**
 * TanStack Query client configuration (Section 8.4 — exact defaults).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * Query Key Factory Pattern (Section 8.4) — prevents key collisions and
 * gives every feature a single, typed place to invalidate/prefetch from.
 * Extended beyond the two examples in the TRD to cover every feature that
 * reads server state, following the same `all` / `list` / `detail` shape.
 */
export const queryKeys = {
  restaurants: {
    all: ['restaurants'] as const,
    list: (filters: ListQueryParams) => ['restaurants', 'list', filters] as const,
    detail: (id: string) => ['restaurants', 'detail', id] as const,
    menu: (id: string) => ['restaurants', 'menu', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (filters: ListQueryParams) => ['orders', 'list', filters] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  search: {
    all: ['search'] as const,
    trains: (query: { trainNumber?: string; pnr?: string; date?: string }) =>
      ['search', 'trains', query] as const,
  },
  profile: {
    all: ['profile'] as const,
    me: () => ['profile', 'me'] as const,
  },
  coupons: {
    all: ['coupons'] as const,
    validate: (code: string) => ['coupons', 'validate', code] as const,
  },
  ratings: {
    all: ['ratings'] as const,
    forRestaurant: (restaurantId: string, filters: ListQueryParams) =>
      ['ratings', 'restaurant', restaurantId, filters] as const,
  },
  support: {
    all: ['support'] as const,
    tickets: (filters: ListQueryParams) => ['support', 'tickets', filters] as const,
    ticketDetail: (id: string) => ['support', 'tickets', 'detail', id] as const,
  },
  invoices: {
    all: ['invoices'] as const,
    byOrder: (orderId: string) => ['invoices', 'order', orderId] as const,
  },
} as const;
