import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, Loader2, Stethoscope, User as UserIcon, X, Pencil, Ban, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SlotPicker, combineDateTime } from "@/components/SlotPicker";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "My Appointments — VitalCare" }] }),
  component: AppointmentsPage,
});

type Appointment = {
  id: string;
  treatment: string;
  doctor: string;
  appointment_at: string;
  patient_name: string;
  email: string;
  phone: string;
  notes: string | null;
  status: string;
  cancelled_at: string | null;
  created_at: string;
};

function AppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<Appointment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [reschedule, setReschedule] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);

  const [filterTime, setFilterTime] = useState<"upcoming" | "past" | "all">("upcoming");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  useEffect(() => {
    if (!authLoading && !user) nav({ to: "/login", search: { redirect: "/appointments" } as any });
  }, [authLoading, user, nav]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_at", { ascending: false });
    if (error) {
      toast.error("Could not load your appointments");
    } else {
      setItems(data as Appointment[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  // Realtime updates on the user's own rows
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("appts-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments", filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, load]);

  if (authLoading || !user) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  const now = Date.now();
  let filtered = (items ?? []).filter((a) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    const isPast = new Date(a.appointment_at).getTime() < now;
    if (filterTime === "upcoming" && isPast) return false;
    if (filterTime === "past" && !isPast) return false;
    return true;
  });

  if (filterTime === "upcoming") {
    filtered.sort((a, b) => new Date(a.appointment_at).getTime() - new Date(b.appointment_at).getTime());
  } else {
    filtered.sort((a, b) => new Date(b.appointment_at).getTime() - new Date(a.appointment_at).getTime());
  }

  return (
    <section className="container max-w-4xl pb-24 pt-32 sm:pt-40">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your <span className="text-gradient-primary">appointments</span>
        </h1>
        <p className="mt-2 text-muted-foreground">View, reschedule, or cancel your visits.</p>
      </motion.div>

      <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-card/40 border border-border/40 rounded-full p-1">
            {(["upcoming", "past", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTime(t)}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-widest rounded-full transition-colors ${
                  filterTime === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex bg-card/40 border border-border/40 rounded-full p-1">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-xs font-medium uppercase tracking-widest rounded-full transition-colors ${
                  filterStatus === s ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Button asChild>
          <Link to="/book">+ New booking</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel mt-6 rounded-2xl p-10 text-center">
          <CalendarCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No appointments found matching your filters.</p>
          {(filterTime !== "upcoming" || filterStatus !== "all") && (
            <Button variant="outline" className="mt-4" onClick={() => { setFilterTime("upcoming"); setFilterStatus("all"); }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {filtered.map((a) => (
            <ApptCard key={a.id} a={a} onReschedule={() => setReschedule(a)} onCancel={() => setCancelling(a)} />
          ))}
        </div>
      )}

      {reschedule && (
        <RescheduleDialog
          appt={reschedule}
          onClose={() => setReschedule(null)}
          onDone={() => { setReschedule(null); load(); }}
        />
      )}
      {cancelling && (
        <CancelDialog
          appt={cancelling}
          onClose={() => setCancelling(null)}
          onDone={() => { setCancelling(null); load(); }}
        />
      )}
    </section>
  );
}

function StatusBadge({ status, when }: { status: string; when: string }) {
  const past = new Date(when).getTime() < Date.now();
  if (status === "cancelled")
    return <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" />Cancelled</Badge>;
  if (status === "confirmed")
    return <Badge className="gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"><CheckCircle2 className="h-3 w-3" />Confirmed</Badge>;
  if (past)
    return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Completed</Badge>;
  return <Badge className="gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"><AlertCircle className="h-3 w-3" />Pending</Badge>;
}

function ApptCard({
  a, onReschedule, onCancel, readOnly,
}: {
  a: Appointment;
  onReschedule?: () => void;
  onCancel?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold">{a.treatment}</h3>
            <StatusBadge status={a.status} when={a.appointment_at} />
          </div>
          <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2"><CalendarCheck className="h-4 w-4" />{format(new Date(a.appointment_at), "PPP")}</div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{format(new Date(a.appointment_at), "p")}</div>
            <div className="flex items-center gap-2"><Stethoscope className="h-4 w-4" />{a.doctor}</div>
            <div className="flex items-center gap-2"><UserIcon className="h-4 w-4" />{a.patient_name}</div>
          </div>
          {a.notes && <p className="mt-3 rounded-lg border border-border/40 bg-card/40 p-3 text-xs text-muted-foreground line-clamp-2">{a.notes}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link to={`/appointments/${a.id}`}>View details</Link>
          </Button>
          {!readOnly && (
            <>
              <Button size="sm" variant="outline" onClick={onReschedule}>
                <Pencil className="h-4 w-4" /> Reschedule
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel} className="text-destructive hover:text-destructive">
                <X className="h-4 w-4" /> Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RescheduleDialog({ appt, onClose, onDone }: { appt: Appointment; onClose: () => void; onDone: () => void }) {
  const initial = new Date(appt.appointment_at);
  const [date, setDate] = useState<Date | undefined>(initial);
  const [time, setTime] = useState(format(initial, "HH:mm"));
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!date || !time) return toast.error("Pick a date and time");
    const slot = combineDateTime(date, time);
    if (slot.getTime() <= Date.now()) return toast.error("Pick a future slot");
    setBusy(true);
    const { error } = await supabase
      .from("appointments")
      .update({ appointment_at: slot.toISOString(), status: "pending" })
      .eq("id", appt.id);
    setBusy(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("That slot was just taken — please pick another.");
      } else {
        console.error(error);
        toast.error("Could not reschedule. Try again.");
      }
      return;
    }
    toast.success("Appointment rescheduled");
    onDone();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reschedule</DialogTitle>
          <DialogDescription>
            {appt.treatment} with {appt.doctor}. Your other details will be preserved.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <SlotPicker doctor={appt.doctor} date={date} setDate={setDate} time={time} setTime={setTime} excludeId={appt.id} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />} Confirm new time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CancelDialog({ appt, onClose, onDone }: { appt: Appointment; onClose: () => void; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("appointments")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", appt.id);
    setBusy(false);
    if (error) {
      console.error(error);
      toast.error("Could not cancel. Try again.");
      return;
    }
    toast.success("Appointment cancelled — slot is now free.");
    onDone();
  };
  return (
    <AlertDialog open onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            {appt.treatment} with {appt.doctor} on {format(new Date(appt.appointment_at), "PPP 'at' p")}.
            The slot will be made available to other patients.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Keep it</AlertDialogCancel>
          <AlertDialogAction onClick={submit} disabled={busy} className="bg-destructive hover:bg-destructive/90">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />} Cancel appointment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
