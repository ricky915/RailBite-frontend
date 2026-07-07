import { FoodCard } from "./FoodCard";
import { FOODS } from "@/data/foods";

const popular = FOODS.filter((f) => ["veg-thali", "chicken-curry-thali", "paneer-butter-masala", "veg-biryani", "chicken-biryani"].includes(f.id));

export function PopularItems() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Popular Items</h2>
        <button className="text-sm font-semibold text-primary hover:underline">View All</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {popular.map((f) => <FoodCard key={f.id} food={f} />)}
      </div>
    </section>
  );
}
