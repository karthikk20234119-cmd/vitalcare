import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: (s.redirect as string) || "/appointments" }),
  head: () => ({ meta: [{ title: "Sign in — VitalCare" }] }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

function LoginPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: search.redirect as any });
  }, [user, loading, nav, search.redirect]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav({ to: search.redirect as any });
  };

  return (
    <section className="container max-w-md pb-24 pt-32 sm:pt-40">
      <div className="glass-panel rounded-3xl p-8">
        <h1 className="font-display text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage and reschedule your appointments.</p>
        <form onSubmit={handle} className="mt-6 space-y-4">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="block text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
              <Link to="/reset-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72} required />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
