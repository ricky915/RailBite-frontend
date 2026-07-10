import { api } from "@/lib/axios";

export interface ApiRating {
  _id: string;
  passengerId: { _id: string; name: string } | string;
  rating: number;
  reviewText?: string;
  createdAt: string;
}

export async function getMenuItemRatings(menuItemId: string): Promise<ApiRating[]> {
  const { data } = await api.get("/ratings", { params: { menuItemId, limit: 10 } });
  return data.data;
}
