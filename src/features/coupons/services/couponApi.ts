import { apiClient } from '@/lib/axios';
import type { ApiSuccessEnvelope } from '@/types/api.types';

import type { ValidateCouponPayload, ValidateCouponResult } from '@/features/coupons/types/coupon.types';

/** Axios calls for the coupons feature (Section 11.4 `POST /api/v1/coupons/validate`). */
export const couponApi = {
  validate: async (payload: ValidateCouponPayload): Promise<ValidateCouponResult> => {
    const { data } = await apiClient.post<ApiSuccessEnvelope<ValidateCouponResult>>(
      '/coupons/validate',
      payload,
    );
    return data.data;
  },
};
