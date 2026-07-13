import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight,
  Smile, Stethoscope, Sparkles, Bone, Syringe, Scissors, HeartPulse, Activity,
  User, Loader2, PartyPopper,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/hooks/use-auth";
import { SlotPicker, combineDateTime } from "@/components/SlotPicker";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Appointment — VitalCare" },
      { name: "description", content: "Book in 60 seconds with live slot availability and instant confirmation." },
    ],
  }),
  component: BookPage,
});

const TREATMENTS = [
  { icon: Smile, name: "Dental Implants" },
  { icon: Stethoscope, name: "Root Canal" },
  { icon: Sparkles, name: "Teeth Whitening" },
  { icon: Bone, name: "Orthodontics" },
  { icon: Syringe, name: "Skin Treatment" },
  { icon: Scissors, name: "Hair Treatment" },
  { icon: HeartPulse, name: "Physiotherapy" },
  { icon: Activity, name: "Health Check-up" },
];

const DOCTORS = [
  { name: "Dr. Aria Kapoor", specialty: "Cosmetic & Implant Dentistry" },
  { name: "Dr. Mateo Rivas", specialty: "Orthodontics & Aligners" },
  { name: "Dr. Lin Chen", specialty: "Dermatology & Skin Sciences" },
  { name: "Dr. Noor Sayed", specialty: "Physiotherapy & Sports Med" },
];

const detailsSchema = z.object({
  patient_name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(5, "Enter a valid phone").max(40),
  notes: z.string().trim().max(1000).optional(),
});

type Step = 0 | 1 | 2 | 3;

function BookPage() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();

  const [step, setStep] = useState<Step>(0);
  const [treatment, setTreatment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [details, setDetails] = useState({
    patient_name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      nav({ to: "/login", search: { redirect: "/book" } as any });
    }
  }, [authLoading, user, nav]);

  useEffect(() => {
    if (user?.email && !details.email) {
      setDetails((d) => ({ ...d, email: user.email! }));
    }
  }, [user, details.email]);

  const progress = useMemo(() => ((step + 1) / 4) * 100, [step]);

  const canNext = useMemo(() => {
    if (step === 0) return Boolean(treatment);
    if (step === 1) return Boolean(doctor && date && time);
    if (step === 2) return detailsSchema.safeParse(details).success;
    return false;
  }, [step, treatment, doctor, date, time, details]);

  const handleSubmit = async () => {
    const parsed = detailsSchema.safeParse(details);
    if (!parsed.success || !date || !time || !doctor || !treatment || !user) {
      toast.error(parsed.success ? "Missing booking details" : parsed.error.issues[0].message);
      return;
    }
    const slot = combineDateTime(date, time);
    if (slot.getTime() <= Date.now()) {
      toast.error("Pick a future time slot.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      treatment,
      doctor,
      appointment_at: slot.toISOString(),
      patient_name: parsed.data.patient_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      notes: parsed.data.notes || null,
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("That slot was just taken — please pick another time.");
        setStep(1);
        setTime("");
      } else {
        console.error(error);
        toast.error("Could not save your booking. Please try again.");
      }
      return;
    }
    setConfirmed(true);
    setStep(3);
  };

  if (authLoading || !user) {
    return (
      <section className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </section>
    );
  }

  if (confirmed) {
    return (
      <PageShell
        eyebrow="Confirmed"
        title={<>You're <span className="text-gradient-primary">all set</span>.</>}
        subtitle={`We'll see you on ${date ? format(date, "PPP") : ""} at ${time}.`}
      >
        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4">
          <div className="rounded-full border border-primary/30 bg-primary/10 p-6">
            <PartyPopper className="h-10 w-10 text-primary" />
          </div>
          <div className="glass-panel w-full rounded-2xl p-5 text-sm">
            <Row label="Treatment" value={treatment} />
            <Row label="Doctor" value={doctor} />
            <Row label="When" value={`${date ? format(date, "PPP") : ""} · ${time}`} />
            <Row label="Status" value="Pending confirmation" />
          </div>
          <div className="flex w-full gap-2">
            <Button asChild size="lg" className="flex-1">
              <Link to="/appointments">Manage bookings</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <section className="relative pb-24 pt-32 sm:pt-40">
      <div className="container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            <CalendarIcon className="h-3.5 w-3.5" /> Book in 60 seconds
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Schedule your <span className="text-gradient-primary">visit</span>.
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Pick a treatment, doctor, and time. Live availability — no double-bookings.
          </p>
        </motion.div>

        <div className="mt-10 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
          <span className={cn(step >= 0 && "text-foreground")}>1. Treatment</span>
          <span className={cn(step >= 1 && "text-foreground")}>2. Doctor & Time</span>
          <span className={cn(step >= 2 && "text-foreground")}>3. Details</span>
          <span className={cn(step >= 3 && "text-foreground")}>4. Done</span>
        </div>
        <Progress value={progress} className="mt-3" />

        <div className="glass-panel mt-8 rounded-3xl p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepWrap key="t">
                <h2 className="font-display text-2xl font-semibold">Choose a treatment</h2>
                <p className="mt-1 text-sm text-muted-foreground">What can we help you with today?</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {TREATMENTS.map((t) => {
                    const Icon = t.icon;
                    const active = treatment === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setTreatment(t.name)}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                          active ? "border-primary/60 bg-primary/10 shadow-glow" : "border-border/60 hover:border-primary/40 hover:bg-card/60",
                        )}
                      >
                        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", active ? "border-primary/40 bg-primary/20 text-primary" : "border-border text-muted-foreground")}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex-1 font-medium">{t.name}</span>
                        {active && <Check className="h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </StepWrap>
            )}

            {step === 1 && (
              <StepWrap key="d">
                <h2 className="font-display text-2xl font-semibold">Pick doctor & time</h2>
                <p className="mt-1 text-sm text-muted-foreground">Live availability — taken slots are crossed out.</p>
                <div className="mt-6 space-y-3">
                  {DOCTORS.map((d) => {
                    const active = doctor === d.name;
                    return (
                      <button
                        key={d.name}
                        type="button"
                        onClick={() => { setDoctor(d.name); setTime(""); }}
                        className={cn("flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all", active ? "border-primary/60 bg-primary/10" : "border-border/60 hover:border-primary/40")}
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground">
                          <User className="h-5 w-5" />
                        </span>
                        <div className="flex-1">
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.specialty}</div>
                        </div>
                        {active && <Check className="h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <SlotPicker doctor={doctor} date={date} setDate={setDate} time={time} setTime={setTime} />
                </div>
              </StepWrap>
            )}

            {step === 2 && (
              <StepWrap key="p">
                <h2 className="font-display text-2xl font-semibold">Your details</h2>
                <p className="mt-1 text-sm text-muted-foreground">We'll use these to keep you posted.</p>
                <div className="mt-6 grid gap-4">
                  <Field label="Full name">
                    <Input value={details.patient_name} onChange={(e) => setDetails({ ...details, patient_name: e.target.value })} placeholder="Jane Doe" maxLength={120} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email">
                      <Input type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} maxLength={255} />
                    </Field>
                    <Field label="Phone">
                      <Input type="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} placeholder="+1 555 123 4567" maxLength={40} />
                    </Field>
                  </div>
                  <Field label="Notes (optional)">
                    <Textarea value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value })} placeholder="Anything we should know?" maxLength={1000} rows={4} />
                  </Field>
                  <div className="glass-panel rounded-2xl p-4 text-sm">
                    <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Summary</div>
                    <Row label="Treatment" value={treatment} />
                    <Row label="Doctor" value={doctor} />
                    <Row label="When" value={`${date ? format(date, "PPP") : ""} · ${time}`} />
                  </div>
                </div>
              </StepWrap>
            )}
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep((s) => (Math.max(0, s - 1) as Step))} disabled={step === 0 || submitting}>
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < 2 ? (
              <Button size="lg" onClick={() => setStep((s) => (Math.min(2, s + 1) as Step))} disabled={!canNext}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleSubmit} disabled={!canNext || submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Confirm booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
      {children}
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
