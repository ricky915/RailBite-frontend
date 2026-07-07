import type { Coupon } from '@/types/domain.types';

/** Request payload for coupon validation (Section 11.4 `POST /api/v1/coupons/validate`). */
export interface ValidateCouponPayload {
  code: string;
  cartSubtotalInPaise: number;
  restaurantId: string;
}

export interface ValidateCouponResult {
  coupon: Coupon;
  discountInPaise: number;
}
