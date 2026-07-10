import vegThali from "@/assets/food-veg-thali.jpg";
import chickenThali from "@/assets/food-chicken-thali.jpg";
import paneer from "@/assets/food-paneer.jpg";
import vegBiryani from "@/assets/food-veg-biryani.jpg";
import chickenBiryani from "@/assets/food-chicken-biryani.jpg";
import snacks from "@/assets/cat-snacks.jpg";
import beverages from "@/assets/cat-beverages.jpg";
import desserts from "@/assets/cat-desserts.jpg";
import combos from "@/assets/cat-combos.jpg";

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

export const CATEGORIES = [
  "Veg Thali",
  "Non-Veg Thali",
  "Biryani",
  "Snacks",
  "Beverages",
  "Combos",
  "Desserts",
] as const;

export const FOODS: Food[] = [
  {
    id: "veg-thali",
    name: "Veg Thali",
    desc: "Dal, Paneer, Rice, 2 Roti, Mix Veg, Salad",
    longDesc:
      "A wholesome platter featuring dal tadka, paneer butter masala, basmati rice, two soft rotis, mixed vegetable curry and fresh salad — a complete homestyle meal.",
    price: 149,
    image: vegThali,
    veg: true,
    category: "Veg Thali",
    bestseller: true,
    rating: 4.5,
    reviewCount: 312,
    ingredients: [
      "Toor dal",
      "Paneer",
      "Basmati rice",
      "Whole wheat",
      "Mixed veg",
      "Salad",
      "Cumin",
      "Garam masala",
    ],
  },
  {
    id: "chicken-curry-thali",
    name: "Chicken Curry Thali",
    desc: "Chicken Curry, Rice, 2 Roti, Dal, Salad",
    longDesc:
      "Tender chicken simmered in a rich onion-tomato gravy, served with steamed rice, soft rotis, dal and salad. Comfort on a plate.",
    price: 179,
    image: chickenThali,
    veg: false,
    category: "Non-Veg Thali",
    bestseller: true,
    rating: 4.6,
    reviewCount: 428,
    ingredients: [
      "Chicken",
      "Onion",
      "Tomato",
      "Rice",
      "Wheat flour",
      "Dal",
      "Ginger-garlic",
      "Spices",
    ],
  },
  {
    id: "paneer-butter-masala",
    name: "Paneer Butter Masala",
    desc: "Paneer Butter Masala, Rice, 2 Roti, Salad",
    longDesc:
      "Cottage cheese cubes in a creamy tomato-cashew gravy, balanced with butter and aromatic spices. Served with rice and rotis.",
    price: 159,
    image: paneer,
    veg: true,
    category: "Veg Thali",
    rating: 4.4,
    reviewCount: 245,
    ingredients: ["Paneer", "Tomato", "Cashew", "Butter", "Cream", "Rice", "Wheat flour"],
  },
  {
    id: "veg-biryani",
    name: "Veg Biryani",
    desc: "Veg Biryani with Raita & Salad",
    longDesc:
      "Long-grain basmati rice layered with seasonal vegetables, saffron and whole spices. Served with cooling raita and salad.",
    price: 129,
    image: vegBiryani,
    veg: true,
    category: "Biryani",
    rating: 4.3,
    reviewCount: 198,
    ingredients: [
      "Basmati rice",
      "Mixed vegetables",
      "Saffron",
      "Yogurt",
      "Whole spices",
      "Mint",
      "Fried onion",
    ],
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    desc: "Chicken Biryani with Raita & Salad",
    longDesc:
      "Slow-cooked Hyderabadi-style chicken biryani with fragrant basmati, marinated chicken and aromatic spices. Served with raita.",
    price: 169,
    image: chickenBiryani,
    veg: false,
    category: "Biryani",
    bestseller: true,
    rating: 4.7,
    reviewCount: 612,
    ingredients: [
      "Basmati rice",
      "Chicken",
      "Yogurt",
      "Saffron",
      "Whole spices",
      "Mint",
      "Fried onion",
    ],
  },
  {
    id: "samosa",
    name: "Crispy Samosa (2 pcs)",
    desc: "Golden samosas with mint chutney",
    longDesc:
      "Crispy, flaky pastry stuffed with spiced potato-pea filling. Served with fresh mint and tamarind chutney.",
    price: 49,
    image: snacks,
    veg: true,
    category: "Snacks",
    rating: 4.5,
    reviewCount: 156,
    ingredients: ["Wheat flour", "Potato", "Green peas", "Cumin", "Coriander", "Mint chutney"],
  },
  {
    id: "rose-lassi",
    name: "Rose Lassi",
    desc: "Chilled rose-flavored yogurt drink",
    longDesc:
      "Creamy yogurt blended with rose syrup and a hint of cardamom — refreshing and perfect for journeys.",
    price: 59,
    image: beverages,
    veg: true,
    category: "Beverages",
    rating: 4.4,
    reviewCount: 92,
    ingredients: ["Yogurt", "Rose syrup", "Sugar", "Cardamom"],
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun (3 pcs)",
    desc: "Warm syrup-soaked milk dumplings",
    longDesc:
      "Soft khoya dumplings deep-fried and soaked in cardamom-rose sugar syrup. A classic Indian dessert.",
    price: 69,
    image: desserts,
    veg: true,
    category: "Desserts",
    bestseller: true,
    rating: 4.8,
    reviewCount: 287,
    ingredients: ["Khoya", "Flour", "Sugar", "Cardamom", "Rose water"],
  },
  {
    id: "deluxe-combo",
    name: "Deluxe Veg Combo",
    desc: "Rice, 2 curries, 2 roti, dessert",
    longDesc:
      "A king-sized combo with steamed rice, two curries of the day, soft rotis and a sweet to finish.",
    price: 199,
    image: combos,
    veg: true,
    category: "Combos",
    rating: 4.5,
    reviewCount: 134,
    ingredients: ["Rice", "Seasonal curries", "Wheat flour", "Dessert", "Salad"],
  },
];

export function getFood(id: string) {
  return FOODS.find((f) => f.id === id);
}
export function similarFoods(id: string, category: string, n = 4) {
  return FOODS.filter((f) => f.id !== id && f.category === category).slice(0, n);
}
