import type { CartItem } from '@/types/domain.types';

/** Request payload for server-side cart validation (Section 11.4 `POST /api/v1/cart/validate`). */
export interface ValidateCartPayload {
  restaurantId: string;
  items: CartItem[];
  couponCode: string | null;
}

export interface CartValidationItemIssue {
  menuItemId: string;
  issue: 'unavailable' | 'price_changed';
  newPriceInPaise?: number;
}

export interface CartValidationResult {
  isValid: boolean;
  issues: CartValidationItemIssue[];
  subtotalInPaise: number;
  deliveryFeeInPaise: number;
  platformFeeInPaise: number;
  gstAmountInPaise: number;
  grandTotalInPaise: number;
}
