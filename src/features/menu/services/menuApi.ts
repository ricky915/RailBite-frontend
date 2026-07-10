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
