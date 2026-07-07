import type { ListQueryParams } from '@/types/api.types';

/**
 * Build a URL query string from filter/sort/pagination objects (Section 3.4
 * `generateQueryString()`). Mirrors the backend's query param contract
 * (Section 11.3): `page`, `pageSize`, `search`, `sortBy`, `sortOrder`, and
 * arbitrary `filter[field]=value` entries.
 *
 * `undefined`, `null`, and empty-string values are omitted entirely so they
 * never override a server-side default.
 */
export function generateQueryString(params: ListQueryParams): string {
  const searchParams = new URLSearchParams();

  const { page, pageSize, search, sortBy, sortOrder, ...filters } = params;

  if (page !== undefined) searchParams.set('page', String(page));
  if (pageSize !== undefined) searchParams.set('pageSize', String(pageSize));
  if (search) searchParams.set('search', search);
  if (sortBy) searchParams.set('sortBy', sortBy);
  if (sortOrder) searchParams.set('sortOrder', sortOrder);

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;
    searchParams.set(`filter[${key}]`, String(value));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Parse a `URLSearchParams` instance (e.g. from `useSearchParams()`) into a
 * plain object of primitive values, used to seed filter/sort/pagination
 * state from the URL (Section 8.7).
 */
export function parseSearchParams(searchParams: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
