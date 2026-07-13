import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — VitalCare" }] }),
  component: SignupPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function SignupPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: "/appointments" });
  }, [user, loading, nav]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      ...parsed.data,
      options: { emailRedirectTo: `${window.location.origin}/appointments` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    nav({ to: "/appointments" });
  };

  return (
    <section className="container max-w-md pb-24 pt-32 sm:pt-40">
      <div className="glass-panel rounded-3xl p-8">
        <h1 className="font-display text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Book and manage appointments in one place.</p>
        <form onSubmit={handle} className="mt-6 space-y-4">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
          </div>
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72} required />
            <p className="mt-1 text-xs text-muted-foreground">Min 8 characters.</p>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Create account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
