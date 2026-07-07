import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope, ListQueryParams, PaginatedData } from '@/types/api.types';
import type { SupportTicket } from '@/types/domain.types';

import type { CreateSupportTicketFormValues } from '@/features/support/schemas/supportTicketSchema';
import { generateQueryString } from '@/utils/queryBuilder';

/**
 * Axios calls for the support feature (Section 11.4: `POST /api/v1/support/tickets`,
 * `GET /api/v1/support/tickets`).
 */
export const supportApi = {
  createTicket: async (payload: CreateSupportTicketFormValues): Promise<SupportTicket> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<SupportTicket>>(
      '/support/tickets',
      payload,
    );
    return data.data;
  },

  listTickets: async (filters: ListQueryParams): Promise<SupportTicket[]> => {
    const queryString = generateQueryString(filters);
    const { data } = await apiClient.get<ApiSuccessEnvelope<PaginatedData<SupportTicket>>>(
      `/support/tickets${queryString}`,
    );
    return data.data.items;
  },
};
