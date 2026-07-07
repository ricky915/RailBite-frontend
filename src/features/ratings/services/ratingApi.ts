import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';
import type { Rating } from '@/types/domain.types';

import type { SubmitRatingPayload } from '@/features/ratings/types/rating.types';

/** Axios calls for the ratings feature (Section 11.4 `POST /api/v1/ratings`). */
export const ratingApi = {
  submit: async (payload: SubmitRatingPayload): Promise<Rating> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Rating>>('/ratings', payload);
    return data.data;
  },
};
