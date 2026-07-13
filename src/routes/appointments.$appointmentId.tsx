import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarCheck, Clock, Loader2, Stethoscope, User as UserIcon, 
  X, Pencil, Ban, CheckCircle2, AlertCircle, ChevronLeft, FileText, Phone, Mail, History
} from "lucide-react";
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

export const Route = createFileRoute("/appointments/$appointmentId")({
  head: () => ({ meta: [{ title: "Appointment Details — VitalCare" }] }),
  component: AppointmentDetailsPage,
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
  updated_at: string;
};

function AppointmentDetailsPage() {
  const { appointmentId } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [reschedule, setReschedule] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !user) nav({ to: "/login", search: { redirect: `/appointments/${appointmentId}` } as any });
  }, [authLoading, user, nav, appointmentId]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();
    
    if (error || !data) {
      toast.error("Could not load this appointment");
      nav({ to: "/appointments" });
    } else {
      setAppt(data as Appointment);
    }
    setLoading(false);
  }, [user, appointmentId, nav]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  if (authLoading || !user || loading || !appt) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  const isPast = new Date(appt.appointment_at).getTime() < Date.now();
  const isCancelled = appt.status === "cancelled";
  const canModify = !isPast && !isCancelled;

  return (
    <section className="container max-w-3xl pb-24 pt-32 sm:pt-40">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/appointments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4" /> Back to appointments
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Appointment <span className="text-gradient-primary">Details</span>
          </h1>
          <StatusBadge status={appt.status} when={appt.appointment_at} />
        </div>
      </motion.div>

      <div className="mt-8 grid gap-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-semibold font-display">Overview</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Treatment</span>
              <p className="font-medium flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> {appt.treatment}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Doctor</span>
              <p className="font-medium flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> {appt.doctor}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Date</span>
              <p className="font-medium flex items-center gap-2"><CalendarCheck className="h-4 w-4 text-primary" /> {format(new Date(appt.appointment_at), "PPPP")}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Time</span>
              <p className="font-medium flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {format(new Date(appt.appointment_at), "p")}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-semibold font-display">Patient Details</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Name</span>
              <p className="font-medium flex items-center gap-2"><UserIcon className="h-4 w-4 text-muted-foreground" /> {appt.patient_name}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
              <p className="font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {appt.email}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Phone</span>
              <p className="font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {appt.phone}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold font-display flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Status Timeline
          </h2>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {/* Booked */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-border/50 bg-card/40">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm">Booked</span>
                  <span className="text-xs text-muted-foreground">{format(new Date(appt.created_at), "MMM d, h:mm a")}</span>
                </div>
                <p className="text-xs text-muted-foreground">Appointment was initially scheduled.</p>
              </div>
            </div>

            {/* Rescheduled / Updated (if modified and not cancelled/confirmed) */}
            {appt.updated_at && new Date(appt.updated_at).getTime() - new Date(appt.created_at).getTime() > 60000 && appt.status === 'pending' && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-amber-500 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-border/50 bg-card/40">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm">Rescheduled</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(appt.updated_at), "MMM d, h:mm a")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Time was changed.</p>
                </div>
              </div>
            )}

            {/* Confirmed */}
            {appt.status === 'confirmed' && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-emerald-500 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-border/50 bg-card/40">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm">Confirmed</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(appt.updated_at), "MMM d, h:mm a")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Doctor confirmed the appointment.</p>
                </div>
              </div>
            )}

            {/* Cancelled */}
            {appt.status === 'cancelled' && appt.cancelled_at && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-destructive bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-border/50 bg-card/40">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm text-destructive">Cancelled</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(appt.cancelled_at), "MMM d, h:mm a")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Appointment was cancelled.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {appt.notes && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 bg-card/50">
            <h2 className="mb-4 text-xl font-semibold font-display flex items-center gap-2">
              <FileText className="h-5 w-5" /> Medical Notes
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{appt.notes}</p>
          </div>
        )}

        {canModify && (
          <div className="mt-4 flex flex-wrap gap-4">
            <Button size="lg" onClick={() => setReschedule(true)} className="flex-1 sm:flex-none">
              <Pencil className="mr-2 h-4 w-4" /> Reschedule
            </Button>
            <Button size="lg" variant="destructive" onClick={() => setCancelling(true)} className="flex-1 sm:flex-none bg-destructive/10 text-destructive hover:bg-destructive/20 border-0">
              <X className="mr-2 h-4 w-4" /> Cancel Appointment
            </Button>
          </div>
        )}
      </div>

      {reschedule && (
        <RescheduleDialog
          appt={appt}
          onClose={() => setReschedule(false)}
          onDone={() => { setReschedule(false); load(); }}
        />
      )}
      {cancelling && (
        <CancelDialog
          appt={appt}
          onClose={() => setCancelling(false)}
          onDone={() => { setCancelling(false); load(); }}
        />
      )}
    </section>
  );
}

function StatusBadge({ status, when }: { status: string; when: string }) {
  const past = new Date(when).getTime() < Date.now();
  if (status === "cancelled")
    return <Badge variant="destructive" className="gap-1.5 px-3 py-1 text-sm"><Ban className="h-4 w-4" />Cancelled</Badge>;
  if (status === "confirmed")
    return <Badge className="gap-1.5 px-3 py-1 text-sm bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"><CheckCircle2 className="h-4 w-4" />Confirmed</Badge>;
  if (past)
    return <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm"><Clock className="h-4 w-4" />Completed</Badge>;
  return <Badge className="gap-1.5 px-3 py-1 text-sm bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"><AlertCircle className="h-4 w-4" />Pending</Badge>;
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
