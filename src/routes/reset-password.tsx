import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — VitalCare" }] }),
  component: ResetPasswordPage,
});

const schema = z.string().trim().email("Enter a valid email").max(255);

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setBusy(false);
    
    if (error) {
      return toast.error(error.message);
    }
    
    setSent(true);
  };

  return (
    <section className="container max-w-md pb-24 pt-32 sm:pt-40">
      <div className="glass-panel rounded-3xl p-8">
        <h1 className="font-display text-3xl font-semibold">Reset Password</h1>
        
        {sent ? (
          <div className="mt-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <p className="text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
            </p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link to="/login">Back to login</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handle} className="mt-6 space-y-4">
              <div>
                <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send reset link
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remembered your password?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </section>
  );
}
