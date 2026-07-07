import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { FOODS, type Food } from "@/data/foods";

// ============ Types ============
export interface CartItem { id: string; qty: number; }
export interface Order {
  id: string;
  userEmail: string;
  items: { id: string; name: string; qty: number; price: number }[];
  total: number;
  pnr?: string;
  coach?: string;
  seat?: string;
  station?: string;
  status: "Placed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
  payment: "Card" | "UPI" | "COD" | "Wallet";
  paid: boolean;
  createdAt: number;
}
export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  blocked?: boolean;
  createdAt: number;
}
export interface Review { id: string; name: string; text: string; rating: number; initial: string; }
export interface HeroSlide { eyebrow: string; title: string; desc: string; cta: string; }
export interface OfferConfig { code: string; percent: number; headline: string; sub: string; }
export interface Social { facebook: string; instagram: string; twitter: string; youtube: string; }
export interface Content {
  hero: HeroSlide[];
  offer: OfferConfig;
  reviews: Review[];
  social: Social;
  privacy: string;
  terms: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

interface State {
  cart: CartItem[];
  orders: Order[];
  users: AppUser[];
  menu: Food[];
  content: Content;
  currentUser: AppUser | null;
  isAdmin: boolean;
}

// ============ Defaults ============
const DEFAULT_CONTENT: Content = {
  hero: [
    { eyebrow: "Tasty Food,", title: "On Track!", desc: "Delicious meals delivered to your seat. Hygienic. Fresh. On Time.", cta: "Order Now" },
    { eyebrow: "Fresh Thalis,", title: "Every Journey!", desc: "Regional flavors, packed hot and delivered station-side.", cta: "Explore Menu" },
    { eyebrow: "Hygienic Kitchens,", title: "Honest Pricing!", desc: "FSSAI-certified partners. Live tracking till your seat.", cta: "See Offers" },
  ],
  offer: { code: "SRFOOD10", percent: 10, headline: "On Your First Order", sub: "Fast Delivery Right to Your Seat" },
  reviews: [
    { id: "r1", name: "Aarav Sharma", text: "Hot food delivered right to my coach seat. Tasted just like home!", rating: 5, initial: "A" },
    { id: "r2", name: "Priya Verma", text: "On-time delivery and great packaging. The thali was generous.", rating: 5, initial: "P" },
    { id: "r3", name: "Rohit Singh", text: "Live tracking is super handy. Loved the biryani — perfectly spiced.", rating: 4, initial: "R" },
  ],
  social: {
    facebook: "https://facebook.com/srfood",
    instagram: "https://instagram.com/srfood",
    twitter: "https://twitter.com/srfood",
    youtube: "https://youtube.com/@srfood",
  },
  privacy: `SRFOOD respects your privacy. We collect the minimum information necessary to deliver your order — name, contact, PNR/seat details, and payment confirmation. We do not sell your data. Payment details are handled by secure PCI-DSS compliant gateways. You may request deletion of your account at any time by contacting support.`,
  terms: `By using SRFOOD you agree to place genuine orders with accurate PNR/seat details. Refunds are issued for undelivered or unsatisfactory orders as per our refund policy. SRFOOD is a marketplace connecting travelers with FSSAI-certified kitchens; food quality is the responsibility of the partner restaurant. Prices are inclusive of applicable taxes unless stated otherwise.`,
  contactEmail: "support@srfood.in",
  contactPhone: "+91 98765 43210",
  contactAddress: "SRFOOD HQ, Sector 21, New Delhi, India",
};

const KEY = "srfood_state_v1";
const ADMIN_PASSWORD = "admin123";

function load(): State {
  if (typeof window === "undefined") return initial();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    const parsed = JSON.parse(raw);
    return { ...initial(), ...parsed, menu: parsed.menu?.length ? parsed.menu : FOODS };
  } catch {
    return initial();
  }
}
function initial(): State {
  return {
    cart: [],
    orders: [],
    users: [],
    menu: FOODS,
    content: DEFAULT_CONTENT,
    currentUser: null,
    isAdmin: false,
  };
}

// ============ Context ============
interface Ctx extends State {
  addToCart: (id: string, qty?: number) => void;
  setCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  registerUser: (u: Omit<AppUser, "id" | "createdAt">) => AppUser;
  loginUser: (email: string) => AppUser | null;
  logout: () => void;
  toggleUserBlock: (id: string) => void;
  loginAdmin: (pw: string) => boolean;
  logoutAdmin: () => void;
  saveMenuItem: (f: Food) => void;
  deleteMenuItem: (id: string) => void;
  updateContent: (c: Partial<Content>) => void;
  addReview: (r: Omit<Review, "id">) => void;
  deleteReview: (id: string) => void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(() => load());

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
  }, [s]);

  const menuMap = new Map(s.menu.map((f) => [f.id, f]));
  const cartCount = s.cart.reduce((a, c) => a + c.qty, 0);
  const cartTotal = s.cart.reduce((a, c) => a + (menuMap.get(c.id)?.price ?? 0) * c.qty, 0);

  const ctx: Ctx = {
    ...s,
    cartCount,
    cartTotal,
    addToCart: (id, qty = 1) =>
      setS((p) => {
        const ex = p.cart.find((c) => c.id === id);
        return {
          ...p,
          cart: ex
            ? p.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c))
            : [...p.cart, { id, qty }],
        };
      }),
    setCartQty: (id, qty) =>
      setS((p) => ({
        ...p,
        cart: qty <= 0 ? p.cart.filter((c) => c.id !== id) : p.cart.map((c) => (c.id === id ? { ...c, qty } : c)),
      })),
    removeFromCart: (id) => setS((p) => ({ ...p, cart: p.cart.filter((c) => c.id !== id) })),
    clearCart: () => setS((p) => ({ ...p, cart: [] })),
    placeOrder: (o) => {
      const order: Order = { ...o, id: `SRF${Date.now().toString().slice(-8)}`, status: "Placed", createdAt: Date.now() };
      setS((p) => ({ ...p, orders: [order, ...p.orders], cart: [] }));
      return order;
    },
    updateOrderStatus: (id, status) =>
      setS((p) => ({ ...p, orders: p.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
    registerUser: (u) => {
      const user: AppUser = { ...u, id: `U${Date.now().toString().slice(-6)}`, createdAt: Date.now() };
      setS((p) => ({ ...p, users: [user, ...p.users], currentUser: user }));
      return user;
    },
    loginUser: (email) => {
      const u = s.users.find((x) => x.email.toLowerCase() === email.toLowerCase()) ?? null;
      if (u) setS((p) => ({ ...p, currentUser: u }));
      return u;
    },
    logout: () => setS((p) => ({ ...p, currentUser: null })),
    toggleUserBlock: (id) =>
      setS((p) => ({ ...p, users: p.users.map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u)) })),
    loginAdmin: (pw) => {
      if (pw === ADMIN_PASSWORD) { setS((p) => ({ ...p, isAdmin: true })); return true; }
      return false;
    },
    logoutAdmin: () => setS((p) => ({ ...p, isAdmin: false })),
    saveMenuItem: (f) =>
      setS((p) => ({
        ...p,
        menu: p.menu.some((m) => m.id === f.id) ? p.menu.map((m) => (m.id === f.id ? f : m)) : [f, ...p.menu],
      })),
    deleteMenuItem: (id) => setS((p) => ({ ...p, menu: p.menu.filter((m) => m.id !== id) })),
    updateContent: (c) => setS((p) => ({ ...p, content: { ...p.content, ...c } })),
    addReview: (r) =>
      setS((p) => ({ ...p, content: { ...p.content, reviews: [{ ...r, id: `r${Date.now()}` }, ...p.content.reviews] } })),
    deleteReview: (id) =>
      setS((p) => ({ ...p, content: { ...p.content, reviews: p.content.reviews.filter((x) => x.id !== id) } })),
  };

  return <StoreCtx.Provider value={ctx}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
