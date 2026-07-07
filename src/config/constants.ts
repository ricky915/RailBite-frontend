/**
 * App-wide constants (Section 4.1 `config/constants.ts`). Magic numbers and
 * strings must be named constants (Section 25.7 / 26).
 */

import { env } from '@/config/env';

export const API_BASE_URL = env.VITE_API_BASE_URL;

export const MAX_CART_QUANTITY_PER_ITEM = 10;
export const MIN_CART_QUANTITY_PER_ITEM = 1;
export const CART_HIGH_VALUE_THRESHOLD_PAISE = 10_00_000; // ₹10,000 (Section 11.6 edge case)

export const DELIVERY_WINDOW_MINUTES = 45;
export const COD_MAX_ORDER_VALUE_PAISE = 50_000; // ₹500 (Section 11.8)

export const RESTAURANTS_PAGE_SIZE = 12;
export const ORDERS_PAGE_SIZE = 20;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const SEARCH_DEBOUNCE_MS = 300;

export const RATING_MAX_STARS = 5;
export const RATING_MAX_REVIEW_LENGTH = 500;
export const RATING_MAX_PHOTOS = 3;

export const SUPPORT_TICKET_MIN_DESCRIPTION_LENGTH = 10;
export const SUPPORT_TICKET_MAX_DESCRIPTION_LENGTH = 1000;

export const SPECIAL_INSTRUCTIONS_MAX_LENGTH = 200;

export const OTP_LENGTH = 6;
export const OTP_VALID_MINUTES = 10;

export const ACCESS_TOKEN_STORAGE_KEY = 'railbite-auth';
export const CART_STORAGE_KEY = 'railbite-cart';

export const TOAST_DEFAULT_DURATION_MS = 4000;
