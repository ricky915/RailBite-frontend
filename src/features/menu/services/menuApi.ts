import { api } from "@/lib/axios";
import type { ApiCategory, ApiMenuItem, ApiRestaurant } from "../types";

export async function getPrimaryRestaurant(): Promise<ApiRestaurant | null> {
  const { data } = await api.get("/restaurants", { params: { limit: 1 } });
  return data.data[0] ?? null;
}

export async function getRestaurantMenu(
  restaurantId: string,
): Promise<{ categories: ApiCategory[]; items: ApiMenuItem[] }> {
  const { data } = await api.get(`/restaurants/${restaurantId}/menu`);
  return data.data;
}

export async function getCategories(): Promise<ApiCategory[]> {
  const { data } = await api.get("/menu/categories");
  return data.data;
}

export async function getMenuItem(id: string): Promise<ApiMenuItem> {
  const { data } = await api.get(`/menu/items/${id}`);
  return data.data;
}

export async function getPopularItems(limit = 5): Promise<ApiMenuItem[]> {
  const { data } = await api.get("/menu/items/popular", { params: { limit } });
  return data.data;
}

export interface MenuItemPayload {
  restaurantId?: string;
  categoryId: string;
  name: string;
  shortDescription?: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
}

export async function createMenuItem(payload: MenuItemPayload): Promise<ApiMenuItem> {
  const { data } = await api.post("/menu/items", payload);
  return data.data;
}

export async function updateMenuItem(
  id: string,
  payload: Partial<MenuItemPayload>,
): Promise<ApiMenuItem> {
  const { data } = await api.patch(`/menu/items/${id}`, payload);
  return data.data;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await api.delete(`/menu/items/${id}`);
}
