import { motion } from "motion/react";
import vegThali from "@/assets/food-veg-thali.jpg";
import nonVegThali from "@/assets/food-chicken-thali.jpg";
import biryani from "@/assets/food-veg-biryani.jpg";
import snacks from "@/assets/cat-snacks.jpg";
import beverages from "@/assets/cat-beverages.jpg";
import combos from "@/assets/cat-combos.jpg";
import desserts from "@/assets/cat-desserts.jpg";

const cats = [
  { name: "Veg Thali", img: vegThali, color: "oklch(0.95 0.08 145)", icon: "🌿" },
  { name: "Non-Veg Thali", img: nonVegThali, color: "oklch(0.95 0.1 30)", icon: "🍗" },
  { name: "Biryani", img: biryani, color: "oklch(0.96 0.1 80)", icon: "🍛" },
  { name: "Snacks", img: snacks, color: "oklch(0.95 0.08 40)", icon: "🥟" },
  { name: "Beverages", img: beverages, color: "oklch(0.95 0.08 300)", icon: "🥤" },
  { name: "Combos", img: combos, color: "oklch(0.95 0.08 0)", icon: "🍱" },
  { name: "Desserts", img: desserts, color: "oklch(0.95 0.08 60)", icon: "🍮" },
];

export function Categories() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button className="text-sm font-semibold text-primary hover:underline">View All</button>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-7">
        {cats.map((c, idx) => (
          <motion.button
            key={c.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            whileHover={{ y: -4 }}
            className="shrink-0 w-32 md:w-auto bg-card border rounded-xl p-3 text-center hover:shadow-card hover:border-primary/30 transition"
          >
            <div className="w-12 h-12 mx-auto rounded-full grid place-items-center text-xl mb-2"
                 style={{ background: c.color }}>
              {c.icon}
            </div>
            <div className="text-sm font-semibold mb-2">{c.name}</div>
            <img src={c.img} alt={c.name} loading="lazy" width={512} height={512}
                 className="w-full aspect-square object-cover rounded-lg" />
          </motion.button>
        ))}
      </div>
    </section>
  );
}
