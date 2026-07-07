import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';

import type { CartValidationResult, ValidateCartPayload } from '@/features/cart/types/cart.types';

/**
 * Axios calls for the cart feature (Section 11.4: `POST /api/v1/cart/validate`).
 * All prices in the cart must be validated against server-side prices before
 * checkout is allowed to proceed (Section 11.6 business rules).
 */
export const cartApi = {
  validate: async (payload: ValidateCartPayload): Promise<CartValidationResult> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<CartValidationResult>>(
      '/cart/validate',
      payload,
    );
    return data.data;
  },
};
