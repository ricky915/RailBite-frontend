import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders – SRFOOD" }] }),
  component: OrdersPage,
});

const statusColor: Record<string, string> = {
  Placed: "bg-blue-100 text-blue-700",
  Preparing: "bg-amber-100 text-amber-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

function OrdersPage() {
  const { orders } = useStore();
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold mb-5">My Orders</h1>
      {!orders.length ? (
        <div className="text-center py-16 bg-card border rounded-2xl">
          <Package className="w-14 h-14 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">You haven't placed any orders yet.</p>
          <Button asChild className="mt-4"><Link to="/menu">Order Now</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="bg-card border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold">#{o.id}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[o.status]}`}>{o.status}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
              </div>
              <div className="mt-2 pt-2 border-t flex items-center justify-between text-sm">
                <span>PNR {o.pnr} • {o.coach}/{o.seat} • {o.station}</span>
                <span className="font-bold">₹{o.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
