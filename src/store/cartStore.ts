import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CART_STORAGE_KEY, MAX_CART_QUANTITY_PER_ITEM } from '@/config/constants';
import type { CartItem } from '@/types/domain.types';

/** Shape exactly per TRD Section 8.5. */
export interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  deliveryStation: string | null;
  trainNumber: string | null;
  coach: string | null;
  seat: string | null;
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
}

export interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryDetails: (details: {
    deliveryStation: string;
    trainNumber: string;
    coach: string;
    seat: string;
  }) => void;
  applyCoupon: (couponCode: string, couponDiscount: number) => void;
  removeCoupon: () => void;
  /** Replaces the whole cart when the user confirms starting a new order from a different restaurant. */
  startNewCartForRestaurant: (restaurantId: string, restaurantName: string, item: CartItem) => void;
}

const initialState: CartState = {
  restaurantId: null,
  restaurantName: null,
  deliveryStation: null,
  trainNumber: null,
  coach: null,
  seat: null,
  items: [],
  couponCode: null,
  couponDiscount: 0,
};

/**
 * Zustand cart store (Section 8.5). Persisted to localStorage under the
 * `railbite-cart` key (Section 15.3). Enforces the single-restaurant-per-cart
 * business rule (Section 11.6) — callers must check `restaurantId` before
 * calling `addItem` and use `startNewCartForRestaurant` to switch restaurants.
 */
export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (existing) =>
            existing.menuItemId === item.menuItemId &&
            JSON.stringify(existing.customizations) === JSON.stringify(item.customizations),
        );

        if (existingIndex >= 0) {
          const nextItems = [...items];
          const existing = nextItems[existingIndex];
          nextItems[existingIndex] = {
            ...existing,
            quantity: Math.min(existing.quantity + item.quantity, MAX_CART_QUANTITY_PER_ITEM),
          };
          set({ items: nextItems });
          return;
        }

        set({ items: [...items, item] });
      },

      removeItem: (menuItemId) => {
        set({ items: get().items.filter((item) => item.menuItemId !== menuItemId) });
      },

      updateQuantity: (menuItemId, quantity) => {
        const clamped = Math.max(1, Math.min(quantity, MAX_CART_QUANTITY_PER_ITEM));
        set({
          items: get().items.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity: clamped } : item,
          ),
        });
      },

      clearCart: () => {
        set({ ...initialState });
      },

      setDeliveryDetails: ({ deliveryStation, trainNumber, coach, seat }) => {
        set({ deliveryStation, trainNumber, coach, seat });
      },

      applyCoupon: (couponCode, couponDiscount) => {
        set({ couponCode, couponDiscount });
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },

      startNewCartForRestaurant: (restaurantId, restaurantName, item) => {
        set({
          ...initialState,
          restaurantId,
          restaurantName,
          items: [item],
        });
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Derived cart subtotal in paise, excluding delivery fee/platform fee/GST/coupon. */
export function selectCartSubtotalInPaise(state: CartState): number {
  return state.items.reduce((total, item) => {
    const customizationTotal = item.customizations.reduce(
      (sum, customization) => sum + customization.additionalChargeInPaise,
      0,
    );
    return total + (item.priceInPaise + customizationTotal) * item.quantity;
  }, 0);
}

export function selectCartItemCount(state: CartState): number {
  return state.items.reduce((count, item) => count + item.quantity, 0);
}
