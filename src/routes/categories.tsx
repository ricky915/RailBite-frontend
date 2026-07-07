import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/data/foods";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories – SRFOOD" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { menu } = useStore();
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold mb-5">All Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((c) => {
          const sample = menu.find((f) => f.category === c);
          const count = menu.filter((f) => f.category === c).length;
          return (
            <Link
              key={c}
              to="/menu"
              search={{ cat: c } as never}
              className="bg-card border rounded-2xl p-4 hover:shadow-card hover:border-primary/30 transition group"
            >
              {sample && <img src={sample.image} alt={c} className="w-full aspect-square object-cover rounded-xl mb-3 group-hover:scale-[1.02] transition" />}
              <h3 className="font-bold">{c}</h3>
              <p className="text-xs text-muted-foreground">{count} items</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
