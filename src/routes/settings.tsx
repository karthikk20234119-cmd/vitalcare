import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, LogOut, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — VitalCare" }] }),
  component: SettingsPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "At least 6 characters").max(72);

function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      nav({ to: "/login", search: { redirect: "/settings" } as any });
    } else if (user) {
      setEmail(user.email || "");
    }
  }, [authLoading, user, nav]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.email === email) return;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setEmailBusy(true);
    const { error } = await supabase.auth.updateUser({ email: parsed.data });
    setEmailBusy(false);

    if (error) {
      return toast.error(error.message);
    }

    toast.success("Verification link sent to your new email. Please check your inbox to confirm the change.");
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setPasswordBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setPasswordBusy(false);

    if (error) {
      return toast.error(error.message);
    }

    setPassword("");
    toast.success("Password updated successfully");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    nav({ to: "/" });
  };

  if (authLoading || !user) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  return (
    <section className="container max-w-2xl pb-24 pt-32 sm:pt-40">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Account <span className="text-gradient-primary">Settings</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your profile, security, and session.</p>
      </div>

      <div className="grid gap-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Profile Details</h2>
              <p className="text-xs text-muted-foreground">Update your email address</p>
            </div>
          </div>
          
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <div className="flex gap-3">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required className="flex-1" />
                <Button type="submit" disabled={emailBusy || user.email === email}>
                  {emailBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
                </Button>
              </div>
            </div>
            {user.email !== email && email.length > 0 && (
              <p className="text-xs text-amber-500/90 bg-amber-500/10 p-2 rounded-md border border-amber-500/20">
                You will need to verify the new email address before the change takes effect.
              </p>
            )}
          </form>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Security</h2>
              <p className="text-xs text-muted-foreground">Update your password</p>
            </div>
          </div>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">New Password</Label>
              <div className="flex gap-3">
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72} placeholder="Enter a new password" required className="flex-1" />
                <Button type="submit" variant="secondary" disabled={passwordBusy || !password}>
                  {passwordBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-destructive">Session</h2>
              <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
            </div>
          </div>
          
          <Button variant="destructive" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" /> Sign out completely
          </Button>
        </div>
      </div>
    </section>
  );
}
