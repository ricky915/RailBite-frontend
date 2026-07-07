import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';
import type { Train } from '@/types/domain.types';

import type { PnrSearchResult } from '@/features/search/types/search.types';

/**
 * Axios calls for the search feature (Section 11.4: `GET /api/v1/trains/search`,
 * `GET /api/v1/trains/pnr/:pnr`).
 */
export const searchApi = {
  searchByTrainNumber: async (trainNumber: string, journeyDate: string): Promise<Train> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Train>>('/trains/search', {
      params: { trainNumber, date: journeyDate },
    });
    return data.data;
  },

  searchByPnr: async (pnr: string): Promise<PnrSearchResult> => {
    const { data } = await apiClient.get<ApiSuccessEnvelope<PnrSearchResult>>(`/trains/pnr/${pnr}`);
    return data.data;
  },
};
