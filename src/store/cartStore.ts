import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartCustomizationSelection {
  groupName: string;
  optionLabel: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  veg: boolean;
  quantity: number;
  customizations: CartCustomizationSelection[];
  specialNote?: string;
}

interface CartState {
  restaurantId: string | null;
  items: CartItem[];
  addItem: (
    restaurantId: string,
    item: Omit<CartItem, "quantity">,
    qty?: number,
  ) => "added" | "restaurant-conflict";
  setQuantity: (menuItemId: string, qty: number) => void;
  removeItem: (menuItemId: string) => void;
  clear: () => void;
}

function itemKey(item: Pick<CartItem, "menuItemId" | "customizations">): string {
  return `${item.menuItemId}::${JSON.stringify(item.customizations)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      items: [],
      addItem: (restaurantId, item, qty = 1) => {
        const state = get();
        if (state.restaurantId && state.restaurantId !== restaurantId && state.items.length > 0) {
          return "restaurant-conflict";
        }
        const key = itemKey(item);
        const existing = state.items.find((i) => itemKey(i) === key);
        set({
          restaurantId,
          items: existing
            ? state.items.map((i) =>
                itemKey(i) === key ? { ...i, quantity: i.quantity + qty } : i,
              )
            : [...state.items, { ...item, quantity: qty }],
        });
        return "added";
      },
      setQuantity: (menuItemId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.menuItemId !== menuItemId)
              : state.items.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: qty } : i)),
        })),
      removeItem: (menuItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.menuItemId !== menuItemId) })),
      clear: () => set({ items: [], restaurantId: null }),
    }),
    { name: "railbite_cart_v1" },
  ),
);

export function selectCartCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartTotal(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
