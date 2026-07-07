import type { ListQueryParams } from '@/types/api.types';
import type { OrderStatus } from '@/types/domain.types';

/** Filters for the order history endpoint (Section 11.10 / 11.4). */
export interface OrderListFilters extends ListQueryParams {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}
