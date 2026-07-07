import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login – SRFOOD" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { registerUser, loginUser } = useStore();
  const nav = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Welcome to SRFOOD</h1>
      <div className="bg-card border rounded-2xl p-5">
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 mb-4"><TabsTrigger value="login">Login</TabsTrigger><TabsTrigger value="signup">Sign Up</TabsTrigger></TabsList>
          <TabsContent value="login"><LoginForm onDone={(email) => {
            let u = loginUser(email);
            if (!u && email === "user@srfood.in") {
              u = registerUser({ name: "Demo User", email, phone: "9876543210" });
            }
            if (u) { toast.success(`Welcome back, ${u.name}`); nav({ to: "/" }); }
            else toast.error("No account with this email. Please sign up.");
          }} /></TabsContent>
          <TabsContent value="signup"><SignupForm onDone={(u) => { registerUser(u); toast.success("Account created!"); nav({ to: "/" }); }} /></TabsContent>
        </Tabs>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-4">
        Admin? <Link to="/admin" className="text-primary hover:underline">Go to Admin Panel</Link>
      </p>
    </div>
  );
}


function LoginForm({ onDone }: { onDone: (email: string) => void }) {
  const [email, setEmail] = useState("user@srfood.in");
  const [password, setPassword] = useState("user123");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onDone(email); }} className="space-y-3">
      <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="space-y-1.5"><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <p className="text-xs text-muted-foreground">Demo credentials prefilled: <span className="font-medium">user@srfood.in / user123</span></p>
      <Button type="submit" className="w-full rounded-full">Login</Button>
    </form>
  );
}

function SignupForm({ onDone }: { onDone: (u: { name: string; email: string; phone: string }) => void }) {
  const [f, setF] = useState({ name: "Demo User", email: "user@srfood.in", phone: "9876543210" });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onDone(f); }} className="space-y-3">
      <div className="space-y-1.5"><Label>Full Name</Label><Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
      <div className="space-y-1.5"><Label>Email</Label><Input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div className="space-y-1.5"><Label>Phone</Label><Input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
      <div className="space-y-1.5"><Label>Password</Label><Input type="password" required placeholder="Any password (demo)" /></div>
      <Button type="submit" className="w-full rounded-full">Create Account</Button>
    </form>
  );
}
