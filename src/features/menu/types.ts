export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  icon?: string;
  displayOrder: number;
}

export interface ApiCustomizationOption {
  label: string;
  priceDeltaPaise: number;
}

export interface ApiCustomizationGroup {
  name: string;
  isRequired: boolean;
  maxSelect: number;
  options: ApiCustomizationOption[];
}

export interface ApiMenuItem {
  _id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
  isBestseller: boolean;
  ingredients: string[];
  isAvailable: boolean;
  customizations: ApiCustomizationGroup[];
  avgRating: number;
  ratingCount: number;
}

export interface ApiRestaurant {
  _id: string;
  name: string;
  stationCodes: string[];
  minOrderValuePaise: number;
  codEligible: boolean;
}
