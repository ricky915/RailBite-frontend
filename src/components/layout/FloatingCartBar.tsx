import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useCartStore, selectCartCount } from "@/store/cartStore";

const HIDDEN_PREFIXES = ["/cart", "/checkout", "/admin"];

/** Global "View cart" pill — floats above content once the cart has items. Mobile only; desktop keeps the header cart button. */
export function FloatingCartBar() {
  const cartCount = useCartStore(selectCartCount);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  if (cartCount === 0 || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <Link
      to="/cart"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-full bg-primary text-primary-foreground pl-3 pr-4 py-2.5 shadow-pop hover:opacity-95 transition md:hidden"
    >
      <span className="w-8 h-8 rounded-full bg-primary-foreground/15 grid place-items-center shrink-0">
        <ShoppingBag className="w-4 h-4" />
      </span>
      <span className="text-left leading-tight">
        <span className="block text-sm font-bold">View cart</span>
        <span className="block text-[11px] opacity-90">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </span>
      </span>
      <ChevronRight className="w-4 h-4 shrink-0" />
    </Link>
  );
}
