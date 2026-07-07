import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, type Order } from "@/lib/store";
import type { Food } from "@/data/foods";
import { CATEGORIES } from "@/data/foods";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Plus, Pencil, Trash2, ShieldCheck, Home, Users, Package, UtensilsCrossed, Palette, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel – SRFOOD" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loginAdmin, logoutAdmin } = useStore();
  const [pw, setPw] = useState("admin123");
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-muted/30 px-4">
        <form
          onSubmit={(e) => { e.preventDefault(); if (!loginAdmin(pw)) toast.error("Wrong password"); }}
          className="bg-card border rounded-2xl p-8 w-full max-w-sm space-y-4"
        >
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground grid place-items-center mx-auto"><ShieldCheck className="w-7 h-7" /></div>
            <h1 className="text-xl font-bold mt-3">Admin Login</h1>
            <p className="text-xs text-muted-foreground">Demo password: <b>admin123</b></p>
          </div>
          <div className="space-y-1.5"><Label>Password</Label><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></div>
          <Button type="submit" className="w-full">Login</Button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-primary">← Back to site</Link>
        </form>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center"><ShieldCheck className="w-5 h-5" /></div>
            <div><div className="font-bold">SRFOOD Admin</div><div className="text-xs text-muted-foreground">Manage everything</div></div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/"><Home className="w-4 h-4 mr-1" />View Site</Link></Button>
            <Button variant="ghost" size="sm" onClick={logoutAdmin}><LogOut className="w-4 h-4 mr-1" />Logout</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6 h-auto">
            <TabsTrigger value="dashboard" className="gap-1.5"><Home className="w-4 h-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="menu" className="gap-1.5"><UtensilsCrossed className="w-4 h-4" />Menu</TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5"><Package className="w-4 h-4" />Orders</TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5"><Users className="w-4 h-4" />Users</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5"><Star className="w-4 h-4" />Reviews</TabsTrigger>
            <TabsTrigger value="content" className="gap-1.5"><Palette className="w-4 h-4" />Content</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><Dashboard /></TabsContent>
          <TabsContent value="menu"><MenuAdmin /></TabsContent>
          <TabsContent value="orders"><OrdersAdmin /></TabsContent>
          <TabsContent value="users"><UsersAdmin /></TabsContent>
          <TabsContent value="reviews"><ReviewsAdmin /></TabsContent>
          <TabsContent value="content"><ContentAdmin /></TabsContent>
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
  const { orders, users, menu } = useStore();
  const revenue = orders.filter((o) => o.paid).reduce((a, o) => a + o.total, 0);
  const pending = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Total Revenue" value={`₹${revenue}`} hint="Paid orders only" />
        <Stat label="Orders" value={orders.length} hint={`${pending} pending`} />
        <Stat label="Users" value={users.length} />
        <Stat label="Menu Items" value={menu.length} />
      </div>
      <div className="bg-card border rounded-2xl p-5">
        <h2 className="font-bold mb-3">Recent Orders</h2>
        {!orders.length ? <p className="text-sm text-muted-foreground">No orders yet.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Customer</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{orders.slice(0, 5).map((o) => (
              <TableRow key={o.id}><TableCell className="font-mono text-xs">{o.id}</TableCell><TableCell>{o.userEmail}</TableCell><TableCell>₹{o.total}</TableCell><TableCell>{o.status}</TableCell></TableRow>
            ))}</TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function MenuAdmin() {
  const { menu, saveMenuItem, deleteMenuItem } = useStore();
  const [editing, setEditing] = useState<Food | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Food | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Menu Items ({menu.length})</h2>
        <Button onClick={() => { setEditing(null); setOpen(true); }}><Plus className="w-4 h-4 mr-1" />Add Item</Button>
      </div>
      <div className="bg-card border rounded-2xl overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Veg</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{menu.map((f) => (
            <TableRow key={f.id}>
              <TableCell><div className="flex items-center gap-3"><img src={f.image} alt="" className="w-10 h-10 rounded object-cover" /><div className="font-medium">{f.name}</div></div></TableCell>
              <TableCell>{f.category}</TableCell><TableCell>₹{f.price}</TableCell><TableCell>{f.veg ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right"><div className="flex gap-1 justify-end">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(f); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => setConfirmDel(f)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div></TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      </div>
      <MenuPanel open={open} onOpenChange={setOpen} food={editing} onSave={(f) => { saveMenuItem(f); toast.success("Saved"); setOpen(false); }} />
      <ConfirmDialog
        open={!!confirmDel}
        title="Delete menu item?"
        description={confirmDel ? `"${confirmDel.name}" will be permanently removed from your menu.` : ""}
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => { if (confirmDel) { deleteMenuItem(confirmDel.id); toast.success("Deleted"); } setConfirmDel(null); }}
      />
    </div>
  );
}

function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", destructive, onCancel, onConfirm }: { open: boolean; title: string; description?: string; confirmLabel?: string; destructive?: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) onCancel(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MenuPanel({ open, onOpenChange, food, onSave }: { open: boolean; onOpenChange: (o: boolean) => void; food: Food | null; onSave: (f: Food) => void }) {
  const empty: Food = { id: "", name: "", desc: "", price: 0, image: "", veg: true, category: CATEGORIES[0] };
  const [f, setF] = useState<Food>(food ?? empty);
  return (
    <Sheet open={open} onOpenChange={(o) => { onOpenChange(o); if (o) setF(food ?? empty); }}>
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] flex flex-col p-0">
        <SheetHeader className="p-5 border-b"><SheetTitle>{food ? "Edit Item" : "Add Menu Item"}</SheetTitle></SheetHeader>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          <div className="space-y-1.5"><Label>Name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Price (₹)</Label><Input type="number" value={f.price} onChange={(e) => setF({ ...f, price: Number(e.target.value) })} /></div>
            <div className="space-y-1.5"><Label>Category</Label>
              <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5"><Label>Image URL</Label><Input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} placeholder="https://..." /></div>
          {f.image && <img src={f.image} alt="" className="w-full h-40 object-cover rounded-lg border" />}
          <div className="flex items-center gap-2"><input type="checkbox" id="veg" checked={f.veg} onChange={(e) => setF({ ...f, veg: e.target.checked })} /><Label htmlFor="veg">Vegetarian</Label></div>
        </div>
        <SheetFooter className="p-5 border-t flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">Cancel</Button>
          <Button className="flex-1 sm:flex-none" onClick={() => {
            if (!f.name || !f.image) { toast.error("Name and image required"); return; }
            onSave({ ...f, id: f.id || f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
          }}>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function OrdersAdmin() {
  const { orders, updateOrderStatus } = useStore();
  const statuses: Order["status"][] = ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
  const revenue = orders.filter((o) => o.paid).reduce((a, o) => a + o.total, 0);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total Orders" value={orders.length} />
        <Stat label="Revenue Collected" value={`₹${revenue}`} />
        <Stat label="Pending" value={orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length} />
      </div>
      <div className="bg-card border rounded-2xl overflow-hidden">
        {!orders.length ? <p className="p-6 text-sm text-muted-foreground text-center">No orders yet.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Items</TableHead><TableHead>Payment</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell><div className="font-mono text-xs">{o.id}</div><div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div></TableCell>
                <TableCell><div className="text-sm">{o.userEmail}</div><div className="text-xs text-muted-foreground">PNR {o.pnr}</div></TableCell>
                <TableCell className="text-xs">{o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}</TableCell>
                <TableCell><div className="text-sm">{o.payment}</div><div className={`text-xs ${o.paid ? "text-green-600" : "text-amber-600"}`}>{o.paid ? "Paid" : "Unpaid"}</div></TableCell>
                <TableCell className="font-bold">₹{o.total}</TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v as Order["status"])}>
                    <SelectTrigger className="w-40 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function UsersAdmin() {
  const { users, toggleUserBlock } = useStore();
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Registered Users ({users.length})</h2>
      <div className="bg-card border rounded-2xl overflow-hidden">
        {!users.length ? <p className="p-6 text-sm text-muted-foreground text-center">No users yet. Users appear here after signing up.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>{users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell><TableCell>{u.email}</TableCell><TableCell>{u.phone}</TableCell>
                <TableCell className="text-xs">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                <TableCell><span className={`text-xs font-semibold ${u.blocked ? "text-destructive" : "text-green-600"}`}>{u.blocked ? "Blocked" : "Active"}</span></TableCell>
                <TableCell className="text-right"><Button size="sm" variant="outline" onClick={() => toggleUserBlock(u.id)}>{u.blocked ? "Unblock" : "Block"}</Button></TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function ReviewsAdmin() {
  const { content, addReview, deleteReview } = useStore();
  const [n, setN] = useState({ name: "", text: "", rating: 5 });
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-lg">Traveler Reviews (shown on homepage)</h2>
      <div className="bg-card border rounded-2xl p-5 grid md:grid-cols-4 gap-3">
        <Input placeholder="Name" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} />
        <Input placeholder="Review text" className="md:col-span-2" value={n.text} onChange={(e) => setN({ ...n, text: e.target.value })} />
        <div className="flex gap-2">
          <Input type="number" min={1} max={5} value={n.rating} onChange={(e) => setN({ ...n, rating: Number(e.target.value) })} />
          <Button onClick={() => {
            if (!n.name || !n.text) return toast.error("Fill all fields");
            addReview({ name: n.name, text: n.text, rating: Math.max(1, Math.min(5, n.rating)), initial: n.name[0].toUpperCase() });
            setN({ name: "", text: "", rating: 5 }); toast.success("Review added");
          }}><Plus className="w-4 h-4" /></Button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {content.reviews.map((r) => (
          <div key={r.id} className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{r.name}</div>
              <Button size="icon" variant="ghost" onClick={() => deleteReview(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
            <div className="text-xs text-primary mb-2">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            <p className="text-sm text-foreground/85">"{r.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentAdmin() {
  const { content, updateContent } = useStore();
  const [c, setC] = useState(content);
  const save = () => { updateContent(c); toast.success("Content updated"); };
  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-2xl p-5 space-y-4">
        <h2 className="font-bold">Hero Slides</h2>
        {c.hero.map((s, i) => (
          <div key={i} className="grid md:grid-cols-4 gap-2 items-start border-b pb-3 last:border-0">
            <Input placeholder="Eyebrow" value={s.eyebrow} onChange={(e) => { const h = [...c.hero]; h[i] = { ...s, eyebrow: e.target.value }; setC({ ...c, hero: h }); }} />
            <Input placeholder="Title" value={s.title} onChange={(e) => { const h = [...c.hero]; h[i] = { ...s, title: e.target.value }; setC({ ...c, hero: h }); }} />
            <Input placeholder="Description" value={s.desc} onChange={(e) => { const h = [...c.hero]; h[i] = { ...s, desc: e.target.value }; setC({ ...c, hero: h }); }} />
            <div className="flex gap-2">
              <Input placeholder="CTA" value={s.cta} onChange={(e) => { const h = [...c.hero]; h[i] = { ...s, cta: e.target.value }; setC({ ...c, hero: h }); }} />
              <Button size="icon" variant="ghost" onClick={() => setC({ ...c, hero: c.hero.filter((_, x) => x !== i) })}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setC({ ...c, hero: [...c.hero, { eyebrow: "", title: "", desc: "", cta: "Order Now" }] })}><Plus className="w-4 h-4 mr-1" />Add Slide</Button>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Homepage Offer Banner</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="space-y-1.5"><Label>Coupon Code</Label><Input value={c.offer.code} onChange={(e) => setC({ ...c, offer: { ...c.offer, code: e.target.value } })} /></div>
          <div className="space-y-1.5"><Label>Percent Off</Label><Input type="number" value={c.offer.percent} onChange={(e) => setC({ ...c, offer: { ...c.offer, percent: Number(e.target.value) } })} /></div>
          <div className="space-y-1.5 md:col-span-2"><Label>Headline</Label><Input value={c.offer.headline} onChange={(e) => setC({ ...c, offer: { ...c.offer, headline: e.target.value } })} /></div>
          <div className="space-y-1.5 md:col-span-4"><Label>Subtitle (shown right side)</Label><Input value={c.offer.sub} onChange={(e) => setC({ ...c, offer: { ...c.offer, sub: e.target.value } })} /></div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Social Media Links</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {(["facebook", "instagram", "twitter", "youtube"] as const).map((k) => (
            <div key={k} className="space-y-1.5"><Label className="capitalize">{k}</Label><Input value={c.social[k]} onChange={(e) => setC({ ...c, social: { ...c.social, [k]: e.target.value } })} /></div>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Contact Info</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1.5"><Label>Email</Label><Input value={c.contactEmail} onChange={(e) => setC({ ...c, contactEmail: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Phone</Label><Input value={c.contactPhone} onChange={(e) => setC({ ...c, contactPhone: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Address</Label><Input value={c.contactAddress} onChange={(e) => setC({ ...c, contactAddress: e.target.value })} /></div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-5 space-y-3">
        <h2 className="font-bold">Legal Pages</h2>
        <div className="space-y-1.5"><Label>Privacy Policy</Label><Textarea rows={6} value={c.privacy} onChange={(e) => setC({ ...c, privacy: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Terms of Service</Label><Textarea rows={6} value={c.terms} onChange={(e) => setC({ ...c, terms: e.target.value })} /></div>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={save} className="shadow-lg">Save All Changes</Button>
      </div>
    </div>
  );
}
