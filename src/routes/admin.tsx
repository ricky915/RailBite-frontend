import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  Home,
  Users,
  Package,
  UtensilsCrossed,
  Palette,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { logoutRequest } from "@/features/auth/services/authApi";
import { isAdminRole, useAuthStore } from "@/store/authStore";
import { getApiErrorMessage } from "@/lib/axios";
import {
  getDashboardSummary,
  listAdminOrders,
  updateOrderStatus,
  listAdminUsers,
  setUserBlocked,
} from "@/features/admin/services/adminApi";
import { nextValidStatuses, statusLabel } from "@/features/admin/orderStatusTransitions";
import {
  getPrimaryRestaurant,
  getRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItemPayload,
} from "@/features/menu/services/menuApi";
import { paiseToRupees } from "@/features/menu/mappers";
import type { ApiCategory, ApiMenuItem } from "@/features/menu/types";
import { listAdminRatings, moderateRating } from "@/features/ratings/services/ratingsApi";
import {
  getHomepage,
  updateHomepage,
  getFaqs,
  updateFaqs,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  getTerms,
  updateTerms,
  getSettings,
  updateSettings,
} from "@/features/cms/services/cmsApi";
import type {
  FaqContent,
  HomepageContent,
  LegalContent,
  SettingsContent,
} from "@/features/cms/types";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel – SRFOOD" }] }),
  component: AdminPage,
});

function AdminPage() {
  const currentUser = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const authLogout = useAuthStore((s) => s.logout);
  const logoutAdmin = () => {
    if (refreshToken) void logoutRequest(refreshToken).catch(() => undefined);
    authLogout();
  };

  if (!isAdminRole(currentUser?.role)) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 px-4">
        <div className="bg-card border rounded-2xl p-8 w-full max-w-sm space-y-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold">Admin Login Required</h1>
          <p className="text-sm text-muted-foreground">
            {currentUser
              ? "Your account does not have admin access."
              : "Please log in with an admin account to continue."}
          </p>
          <Button asChild className="w-full">
            <Link to="/auth">Go to Login</Link>
          </Button>
          <Link
            to="/"
            className="block text-center text-xs text-muted-foreground hover:text-primary"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold">SRFOOD Admin</div>
              <div className="text-xs text-muted-foreground">Manage everything</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="w-4 h-4 mr-1" />
                View Site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={logoutAdmin}>
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 h-auto">
            <TabsTrigger value="dashboard" className="gap-1.5">
              <Home className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="menu" className="gap-1.5">
              <UtensilsCrossed className="w-4 h-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5">
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5">
              <Star className="w-4 h-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-1.5">
              <Palette className="w-4 h-4" />
              Content
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="menu">
            <MenuAdmin />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersAdmin />
          </TabsContent>
          <TabsContent value="users">
            <UsersAdmin />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsAdmin />
          </TabsContent>
          <TabsContent value="content">
            <ContentAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-card border rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboardSummary,
  });

  if (isLoading || !data) {
    return <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat
          label="Total Revenue"
          value={`₹${paiseToRupees(data.totalRevenuePaise)}`}
          hint="Captured payments only"
        />
        <Stat label="Orders" value={data.totalOrders} hint={`${data.pendingOrders} pending`} />
        <Stat label="Users" value={data.totalUsers} />
        <Stat label="Menu Items" value={data.totalMenuItems} />
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h2 className="font-bold mb-3">Recent Orders</h2>
        {!data.recentOrders.length ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentOrders.map((o) => (
                <TableRow key={o._id}>
                  <TableCell className="font-mono text-xs">{o.orderId}</TableCell>
                  <TableCell>₹{paiseToRupees(o.grandTotal)}</TableCell>
                  <TableCell>{statusLabel(o.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function MenuAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-menu"],
    queryFn: async () => {
      const restaurant = await getPrimaryRestaurant();
      if (!restaurant)
        return {
          restaurantId: null as string | null,
          categories: [] as ApiCategory[],
          items: [] as ApiMenuItem[],
        };
      const menu = await getRestaurantMenu(restaurant._id);
      return { restaurantId: restaurant._id, categories: menu.categories, items: menu.items };
    },
  });
  const restaurantId = data?.restaurantId ?? null;
  const categories = data?.categories ?? [];
  const items = data?.items ?? [];
  const categoryName = (id: string) => categories.find((c) => c._id === id)?.name ?? "—";

  const [editing, setEditing] = useState<ApiMenuItem | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<ApiMenuItem | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-menu"] });

  const saveMutation = useMutation({
    mutationFn: (payload: MenuItemPayload) =>
      editing ? updateMenuItem(editing._id, payload) : createMenuItem(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
      setOpen(false);
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      invalidate();
      toast.success("Deleted");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>;
  if (!restaurantId)
    return (
      <p className="text-sm text-muted-foreground py-10 text-center">
        No restaurant found — seed one first.
      </p>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Menu Items ({items.length})</h2>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>
      <div className="bg-card border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Veg</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((f) => (
              <TableRow key={f._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={f.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                    <div className="font-medium">{f.name}</div>
                  </div>
                </TableCell>
                <TableCell>{categoryName(f.categoryId)}</TableCell>
                <TableCell>₹{paiseToRupees(f.price)}</TableCell>
                <TableCell>{f.isVeg ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(f);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(f)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <MenuPanel
        open={open}
        onOpenChange={setOpen}
        item={editing}
        categories={categories}
        onSave={(payload) =>
          saveMutation.mutate(restaurantId ? { ...payload, restaurantId } : payload)
        }
      />
      <ConfirmDialog
        open={!!confirmDel}
        title="Delete menu item?"
        description={
          confirmDel ? `"${confirmDel.name}" will be permanently removed from your menu.` : ""
        }
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => {
          if (confirmDel) deleteMutation.mutate(confirmDel._id);
          setConfirmDel(null);
        }}
      />
    </div>
  );
}

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  destructive,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface MenuDraft {
  name: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  categoryId: string;
}

function MenuPanel({
  open,
  onOpenChange,
  item,
  categories,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  item: ApiMenuItem | null;
  categories: ApiCategory[];
  onSave: (payload: MenuItemPayload) => void;
}) {
  const empty: MenuDraft = {
    name: "",
    shortDescription: "",
    price: 0,
    imageUrl: "",
    isVeg: true,
    categoryId: categories[0]?._id ?? "",
  };
  const toDraft = (i: ApiMenuItem | null): MenuDraft =>
    i
      ? {
          name: i.name,
          shortDescription: i.shortDescription ?? "",
          price: paiseToRupees(i.price),
          imageUrl: i.imageUrl ?? "",
          isVeg: i.isVeg,
          categoryId: i.categoryId,
        }
      : empty;
  const [f, setF] = useState<MenuDraft>(toDraft(item));

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) setF(toDraft(item));
      }}
    >
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] flex flex-col p-0">
        <SheetHeader className="p-5 border-b">
          <SheetTitle>{item ? "Edit Item" : "Add Menu Item"}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={f.shortDescription}
              onChange={(e) => setF({ ...f, shortDescription: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={f.price}
                onChange={(e) => setF({ ...f, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={f.categoryId} onValueChange={(v) => setF({ ...f, categoryId: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input
              value={f.imageUrl}
              onChange={(e) => setF({ ...f, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          {f.imageUrl && (
            <img src={f.imageUrl} alt="" className="w-full h-40 object-cover rounded-lg border" />
          )}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="veg"
              checked={f.isVeg}
              onChange={(e) => setF({ ...f, isVeg: e.target.checked })}
            />
            <Label htmlFor="veg">Vegetarian</Label>
          </div>
        </div>
        <SheetFooter className="p-5 border-t flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 sm:flex-none"
            onClick={() => {
              if (!f.name || !f.imageUrl || !f.categoryId) {
                toast.error("Name, image and category are required");
                return;
              }
              onSave({
                name: f.name,
                shortDescription: f.shortDescription,
                price: Math.round(f.price * 100),
                imageUrl: f.imageUrl,
                isVeg: f.isVeg,
                categoryId: f.categoryId,
              });
            }}
          >
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function OrdersAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => listAdminOrders({ limit: 100 }),
  });
  const orders = data?.items ?? [];
  const revenue = orders
    .filter((o) => o.paymentStatus === "captured")
    .reduce((a, o) => a + o.grandTotal, 0);
  const TERMINAL = [
    "DELIVERED",
    "COMPLETED",
    "CANCELLED_BY_PASSENGER",
    "CANCELLED_BY_RESTAURANT",
    "CANCELLED_BY_ADMIN",
    "REFUND_PROCESSED",
    "PAYMENT_FAILED",
  ];
  const pending = orders.filter((o) => !TERMINAL.includes(o.status)).length;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total Orders" value={orders.length} />
        <Stat label="Revenue Collected" value={`₹${paiseToRupees(revenue)}`} />
        <Stat label="Pending" value={pending} />
      </div>
      <div className="bg-card border rounded-2xl overflow-hidden">
        {!orders.length ? (
          <p className="p-6 text-sm text-muted-foreground text-center">No orders yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => {
                const nextOptions = nextValidStatuses(o.status);
                return (
                  <TableRow key={o._id}>
                    <TableCell>
                      <div className="font-mono text-xs">{o.orderId}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {o.items.map((i) => `${i.name}×${i.quantity}`).join(", ")}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{o.paymentMethod}</div>
                      <div
                        className={`text-xs ${o.paymentStatus === "captured" ? "text-green-600" : "text-amber-600"}`}
                      >
                        {o.paymentStatus}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">₹{paiseToRupees(o.grandTotal)}</TableCell>
                    <TableCell>
                      {nextOptions.length === 0 ? (
                        <span className="text-xs font-semibold">{statusLabel(o.status)}</span>
                      ) : (
                        <Select
                          key={o.status}
                          onValueChange={(v) => statusMutation.mutate({ id: o._id, status: v })}
                        >
                          <SelectTrigger className="w-44 h-8">
                            <SelectValue placeholder={statusLabel(o.status)} />
                          </SelectTrigger>
                          <SelectContent>
                            {nextOptions.map((s) => (
                              <SelectItem key={s} value={s}>
                                {statusLabel(s)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function UsersAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listAdminUsers({ limit: 100 }),
  });
  const users = data?.items ?? [];

  const blockMutation = useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      setUserBlocked(id, isBlocked),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>;

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Registered Users ({users.length})</h2>
      <div className="bg-card border rounded-2xl overflow-hidden">
        {!users.length ? (
          <p className="p-6 text-sm text-muted-foreground text-center">
            No users yet. Users appear here after signing up.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.mobile}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-semibold ${u.isBlocked ? "text-destructive" : "text-green-600"}`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => blockMutation.mutate({ id: u._id, isBlocked: !u.isBlocked })}
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function ReviewsAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-ratings"],
    queryFn: () => listAdminRatings({ limit: 50 }),
  });
  const ratings = data ?? [];

  const moderateMutation = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { isHidden?: boolean; isFeatured?: boolean };
    }) => moderateRating(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-ratings"] }),
    onError: (e) => toast.error(getApiErrorMessage(e)),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>;

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Ratings &amp; Reviews Moderation</h2>
      {!ratings.length ? (
        <p className="text-sm text-muted-foreground">
          No ratings submitted yet — they appear here once passengers rate a delivered order.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-3">
          {ratings.map((r) => {
            const name = typeof r.passengerId === "string" ? "Traveler" : r.passengerId.name;
            return (
              <div
                key={r._id}
                className={`bg-card border rounded-2xl p-4 ${r.isHidden ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{name}</div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      title={r.isFeatured ? "Unfeature" : "Feature on homepage"}
                      onClick={() =>
                        moderateMutation.mutate({ id: r._id, patch: { isFeatured: !r.isFeatured } })
                      }
                    >
                      <Star
                        className={`w-4 h-4 ${r.isFeatured ? "fill-primary text-primary" : ""}`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      title={r.isHidden ? "Unhide" : "Hide"}
                      onClick={() =>
                        moderateMutation.mutate({ id: r._id, patch: { isHidden: !r.isHidden } })
                      }
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-primary mb-2">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </div>
                <p className="text-sm text-foreground/85">
                  {r.reviewText ? (
                    `"${r.reviewText}"`
                  ) : (
                    <span className="italic text-muted-foreground">No written review</span>
                  )}
                </p>
                {r.isHidden && (
                  <p className="text-xs text-destructive mt-2">Hidden from public view</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ContentAdmin() {
  const queryClient = useQueryClient();
  const emptyHomepage: HomepageContent = {
    hero: [],
    offer: { code: "", percent: 0, headline: "", sub: "" },
  };
  const emptyFaq: FaqContent = { faqs: [] };
  const emptyLegal: LegalContent = { text: "" };
  const emptySettings: SettingsContent = {
    social: {},
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
  };

  const { data: homepage } = useQuery({
    queryKey: ["cms-homepage"],
    queryFn: () => getHomepage().catch(() => emptyHomepage),
  });
  const { data: faqData } = useQuery({
    queryKey: ["cms-faqs"],
    queryFn: () => getFaqs().catch(() => emptyFaq),
  });
  const { data: privacy } = useQuery({
    queryKey: ["cms-privacy"],
    queryFn: () => getPrivacyPolicy().catch(() => emptyLegal),
  });
  const { data: terms } = useQuery({
    queryKey: ["cms-terms"],
    queryFn: () => getTerms().catch(() => emptyLegal),
  });
  const { data: settings } = useQuery({
    queryKey: ["cms-settings"],
    queryFn: () => getSettings().catch(() => emptySettings),
  });

  const [heroDraft, setHeroDraft] = useState<HomepageContent | null>(null);
  const [faqDraft, setFaqDraft] = useState<FaqContent | null>(null);
  const [privacyDraft, setPrivacyDraft] = useState<LegalContent | null>(null);
  const [termsDraft, setTermsDraft] = useState<LegalContent | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<SettingsContent | null>(null);

  useEffect(() => {
    if (homepage && !heroDraft) setHeroDraft(homepage);
  }, [homepage, heroDraft]);
  useEffect(() => {
    if (faqData && !faqDraft) setFaqDraft(faqData);
  }, [faqData, faqDraft]);
  useEffect(() => {
    if (privacy && !privacyDraft) setPrivacyDraft(privacy);
  }, [privacy, privacyDraft]);
  useEffect(() => {
    if (terms && !termsDraft) setTermsDraft(terms);
  }, [terms, termsDraft]);
  useEffect(() => {
    if (settings && !settingsDraft) setSettingsDraft(settings);
  }, [settings, settingsDraft]);

  const save = async () => {
    try {
      if (heroDraft) await updateHomepage(heroDraft);
      if (faqDraft) await updateFaqs(faqDraft);
      if (privacyDraft) await updatePrivacyPolicy(privacyDraft);
      if (termsDraft) await updateTerms(termsDraft);
      if (settingsDraft) await updateSettings(settingsDraft);
      toast.success("Content updated");
      queryClient.invalidateQueries({ queryKey: ["cms-homepage"] });
      queryClient.invalidateQueries({ queryKey: ["cms-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["cms-privacy"] });
      queryClient.invalidateQueries({ queryKey: ["cms-terms"] });
      queryClient.invalidateQueries({ queryKey: ["cms-settings"] });
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  if (!heroDraft || !faqDraft || !privacyDraft || !termsDraft || !settingsDraft) {
    return <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>;
  }
  const c = heroDraft;

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-2xl p-5 space-y-4">
        <h2 className="font-bold">Hero Slides</h2>
        {c.hero.map((s, i) => (
          <div
            key={i}
            className="grid md:grid-cols-4 gap-2 items-start border-b pb-3 last:border-0"
          >
            <Input
              placeholder="Eyebrow"
              value={s.eyebrow}
              onChange={(e) => {
                const h = [...c.hero];
                h[i] = { ...s, eyebrow: e.target.value };
                setHeroDraft({ ...c, hero: h });
              }}
            />
            <Input
              placeholder="Title"
              value={s.title}
              onChange={(e) => {
                const h = [...c.hero];
                h[i] = { ...s, title: e.target.value };
                setHeroDraft({ ...c, hero: h });
              }}
            />
            <Input
              placeholder="Description"
              value={s.desc}
              onChange={(e) => {
                const h = [...c.hero];
                h[i] = { ...s, desc: e.target.value };
                setHeroDraft({ ...c, hero: h });
              }}
            />
            <div className="flex gap-2">
              <Input
                placeholder="CTA"
                value={s.cta}
                onChange={(e) => {
                  const h = [...c.hero];
                  h[i] = { ...s, cta: e.target.value };
                  setHeroDraft({ ...c, hero: h });
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setHeroDraft({ ...c, hero: c.hero.filter((_, x) => x !== i) })}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setHeroDraft({
              ...c,
              hero: [...c.hero, { eyebrow: "", title: "", desc: "", cta: "Order Now" }],
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Slide
        </Button>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Homepage Offer Banner</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label>Coupon Code</Label>
            <Input
              value={c.offer.code}
              onChange={(e) => setHeroDraft({ ...c, offer: { ...c.offer, code: e.target.value } })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Percent Off</Label>
            <Input
              type="number"
              value={c.offer.percent}
              onChange={(e) =>
                setHeroDraft({ ...c, offer: { ...c.offer, percent: Number(e.target.value) } })
              }
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Headline</Label>
            <Input
              value={c.offer.headline}
              onChange={(e) =>
                setHeroDraft({ ...c, offer: { ...c.offer, headline: e.target.value } })
              }
            />
          </div>
          <div className="space-y-1.5 md:col-span-4">
            <Label>Subtitle (shown right side)</Label>
            <Input
              value={c.offer.sub}
              onChange={(e) => setHeroDraft({ ...c, offer: { ...c.offer, sub: e.target.value } })}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-4">
        <h2 className="font-bold">FAQs</h2>
        {faqDraft.faqs.map((item, i) => (
          <div
            key={i}
            className="grid md:grid-cols-[1fr_2fr_auto] gap-2 items-start border-b pb-3 last:border-0"
          >
            <Input
              placeholder="Question"
              value={item.question}
              onChange={(e) => {
                const f = [...faqDraft.faqs];
                f[i] = { ...item, question: e.target.value };
                setFaqDraft({ faqs: f });
              }}
            />
            <Textarea
              rows={2}
              placeholder="Answer"
              value={item.answer}
              onChange={(e) => {
                const f = [...faqDraft.faqs];
                f[i] = { ...item, answer: e.target.value };
                setFaqDraft({ faqs: f });
              }}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFaqDraft({ faqs: faqDraft.faqs.filter((_, x) => x !== i) })}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setFaqDraft({
              faqs: [
                ...faqDraft.faqs,
                { question: "", answer: "", displayOrder: faqDraft.faqs.length },
              ],
            })
          }
        >
          <Plus className="w-4 h-4 mr-1" />
          Add FAQ
        </Button>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Social Media Links</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {(["facebook", "instagram", "twitter", "youtube"] as const).map((k) => (
            <div key={k} className="space-y-1.5">
              <Label className="capitalize">{k}</Label>
              <Input
                value={settingsDraft.social[k] ?? ""}
                onChange={(e) =>
                  setSettingsDraft({
                    ...settingsDraft,
                    social: { ...settingsDraft.social, [k]: e.target.value },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Contact Info</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={settingsDraft.contactEmail}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, contactEmail: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input
              value={settingsDraft.contactPhone}
              onChange={(e) => setSettingsDraft({ ...settingsDraft, contactPhone: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Input
              value={settingsDraft.contactAddress}
              onChange={(e) =>
                setSettingsDraft({ ...settingsDraft, contactAddress: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Legal Pages</h2>
        <div className="space-y-1.5">
          <Label>Privacy Policy</Label>
          <Textarea
            rows={6}
            value={privacyDraft.text}
            onChange={(e) => setPrivacyDraft({ text: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Terms of Service</Label>
          <Textarea
            rows={6}
            value={termsDraft.text}
            onChange={(e) => setTermsDraft({ text: e.target.value })}
          />
        </div>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={save} className="shadow-lg">
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
