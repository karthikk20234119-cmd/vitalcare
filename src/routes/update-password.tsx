import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/update-password")({
  head: () => ({ meta: [{ title: "Update Password — VitalCare" }] }),
  component: UpdatePasswordPage,
});

const schema = z.string().min(6, "At least 6 characters").max(72);

function UpdatePasswordPage() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // If not loading and no user, they might have hit this page without a valid reset token.
    // However, sometimes it takes a split second for the session to establish from the hash.
    // We'll redirect to login if they are definitively not logged in after a short delay.
    if (!loading && !user) {
      const timer = setTimeout(() => {
        if (!user) nav({ to: "/login" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, user, nav]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(password);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setBusy(false);
    
    if (error) {
      return toast.error(error.message);
    }
    
    toast.success("Password updated successfully");
    nav({ to: "/settings" });
  };

  if (loading || (!user && busy)) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  return (
    <section className="container max-w-md pb-24 pt-32 sm:pt-40">
      <div className="glass-panel rounded-3xl p-8">
        <h1 className="font-display text-3xl font-semibold">New Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please enter your new password below.
        </p>
        
        <form onSubmit={handle} className="mt-6 space-y-4">
          <div>
            <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">New Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72} required />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy || !user}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Save new password
          </Button>
        </form>
      </div>
    </section>
  );
}
