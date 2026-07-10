export interface Food {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  veg: boolean;
  category: string;
  bestseller?: boolean;
  rating?: number;
  reviewCount?: number;
  ingredients?: string[];
  longDesc?: string;
  /** Populated when sourced from the real menu API — required to add the item to cart/checkout. */
  restaurantId?: string;
}
