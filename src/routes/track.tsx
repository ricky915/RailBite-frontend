import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Check, ChefHat, Bike, PackageCheck, Circle } from "lucide-react";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track Order – SRFOOD" }] }),
  component: TrackPage,
});

const stages = ["Placed", "Preparing", "Out for Delivery", "Delivered"] as const;
const icons = [Check, ChefHat, Bike, PackageCheck];

function TrackPage() {
  const { orders } = useStore();
  const latest = orders[0];
  if (!latest) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-muted-foreground">No active orders to track.</p>
      </div>
    );
  }
  const idx = stages.indexOf(latest.status as (typeof stages)[number]);
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold">Track Order #{latest.id}</h1>
      <p className="text-muted-foreground text-sm">PNR {latest.pnr} • Coach {latest.coach} • Seat {latest.seat} • {latest.station}</p>

      <div className="mt-8 bg-card border rounded-2xl p-6">
        <div className="grid grid-cols-4 gap-2">
          {stages.map((s, i) => {
            const I = icons[i];
            const active = i <= idx;
            return (
              <div key={s} className="flex flex-col items-center text-center gap-2">
                <div className={`w-12 h-12 rounded-full grid place-items-center border-2 ${active ? "bg-primary text-primary-foreground border-primary" : "border-muted text-muted-foreground"}`}>
                  {active ? <I className="w-5 h-5" /> : <Circle className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / stages.length) * 100}%` }} />
        </div>
      </div>

      <div className="mt-6 bg-card border rounded-2xl p-5">
        <h2 className="font-bold mb-3">Items</h2>
        {latest.items.map((it) => (
          <div key={it.id} className="flex justify-between text-sm py-1">
            <span>{it.name} × {it.qty}</span><span>₹{it.price * it.qty}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span><span>₹{latest.total}</span>
        </div>
      </div>
    </div>
  );
}
