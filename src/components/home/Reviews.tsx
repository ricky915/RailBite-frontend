import { Star } from "lucide-react";
import { motion } from "motion/react";
import { useStore } from "@/lib/store";

export function Reviews() {
  const { content } = useStore();
  const reviews = content.reviews;
  if (!reviews.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">What Travelers Say</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {reviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border rounded-2xl p-5 hover:shadow-card transition"
          >
            <div className="flex gap-0.5 text-primary mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className={`w-4 h-4 ${idx < r.rating ? "fill-current" : "opacity-30"}`} />
              ))}
            </div>
            <p className="text-sm text-foreground/85">"{r.text}"</p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary font-bold grid place-items-center">{r.initial}</div>
              <div>
                <div className="font-semibold text-sm">{r.name}</div>
                <div className="text-xs text-muted-foreground">Verified Traveler</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
