/**
 * Response envelope types shared by every API call (Section 10.6).
 * All backend responses conform to one of these two shapes.
 */

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  message: string;
  errors?: ApiFieldError[];
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

/** Generic paginated list payload returned inside `data` for list endpoints. */
export interface PaginatedData<T> {
  items: T[];
}

/** Standard pagination/sort/filter query params sent to list endpoints (Section 11.3). */
export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [filterKey: string]: string | number | boolean | undefined;
}
