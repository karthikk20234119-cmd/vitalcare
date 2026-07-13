import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Star,
  ShieldCheck,
  Award,
  Stethoscope,
  Smile,
  Bone,
  Scissors,
  HeartPulse,
  Syringe,
  Activity,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Calendar,
} from "lucide-react";
import heroImg from "@/assets/hero-medical.jpg";
import doctorImg from "@/assets/doctor-portrait.jpg";
import { CountUp } from "@/components/CountUp";
import { EmergencyBar } from "@/components/EmergencyBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VitalCare — The Future of Smart Medical Care" },
      { name: "description", content: "Advanced digital healthcare experience. Book appointments, meet world-class doctors, and explore precision treatments — all powered by modern technology." },
    ],
  }),
  component: HomePage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const treatments = [
  { icon: Smile, name: "Dental Implants", desc: "Permanent, natural-feeling tooth replacement.", slug: "dental-implants" },
  { icon: Stethoscope, name: "Root Canal", desc: "Pain-free, single-sitting endodontic care.", slug: "root-canal" },
  { icon: Sparkles, name: "Teeth Whitening", desc: "Cosmetic brightening in under an hour.", slug: "teeth-whitening" },
  { icon: Bone, name: "Orthodontics", desc: "Invisible aligners & advanced braces.", slug: "orthodontics" },
  { icon: Syringe, name: "Skin Treatment", desc: "Dermatology powered by AI diagnostics.", slug: "skin" },
  { icon: Scissors, name: "Hair Treatment", desc: "PRP, transplants & follicle therapy.", slug: "hair" },
  { icon: HeartPulse, name: "Physiotherapy", desc: "Recovery, mobility & pain relief.", slug: "physio" },
  { icon: Activity, name: "Health Check-ups", desc: "Comprehensive preventive screenings.", slug: "checkups" },
];

function HomePage() {
  return (
    <>
      <Hero />
      <Treatments />
      <Stats />
      <Doctor />
      <Testimonials />
      <BookingStrip />
      <EmergencyBar />
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[92vh] -mt-20 pt-20 bg-hero overflow-hidden">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="glow-orb size-[500px] -top-40 -left-40" style={{ background: "oklch(0.66 0.20 255 / 0.45)" }} aria-hidden />
      <div className="glow-orb size-[420px] top-1/3 -right-32" style={{ background: "oklch(0.82 0.15 220 / 0.35)" }} aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-cyan">
            <Sparkles className="size-3.5" /> AI-powered precision care · Open today
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display font-bold leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            The future of <span className="text-gradient">smart medical care</span> starts here.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground">
            Trusted by 10,000+ patients · ISO 9001 certified · 15 years of clinical excellence.
            World-class doctors, cinematic experience, real human care.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-white animate-pulse-glow">
              Book Appointment
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 font-semibold hover:border-cyan transition">
              Free Consultation
            </Link>
            <a href="https://wa.me/919999999999" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-foreground border border-glass-border hover:bg-white/5 transition">
              <MessageCircle className="size-4 text-green-400" /> WhatsApp
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="size-3.5 fill-yellow-400 text-yellow-400" /> 4.9 Google Rating</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-cyan" /> ISO 9001 Certified</span>
            <span className="flex items-center gap-1.5"><Award className="size-3.5 text-cyan" /> 15 Years Experience</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
          <div className="relative aspect-square rounded-3xl overflow-hidden glass">
            <img
              src={heroImg}
              alt="Holographic DNA helix and human heart visualization"
              width={1536}
              height={1536}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-transparent to-transparent" />
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-4 top-10 glass rounded-2xl p-4 shadow-elevated"
          >
            <div className="text-xs text-muted-foreground">Live patients today</div>
            <div className="font-display text-2xl font-bold text-gradient-primary">42</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-2 bottom-12 glass rounded-2xl p-4 shadow-elevated"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-cyan" />
              <div>
                <div className="text-xs text-muted-foreground">Surgery success</div>
                <div className="font-display text-xl font-bold">98.6%</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground text-xs"
      >
        Scroll to explore
        <ChevronDown className="size-4" />
      </motion.div>
    </section>
  );
}

function Treatments() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-cyan font-accent">Treatments</p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl tracking-tight">
            Care for every part of <span className="text-gradient-primary">you</span>.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From precision dentistry to dermatology and physiotherapy — all under one roof,
            with the same uncompromising standard.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {treatments.map((t, i) => (
            <motion.div
              key={t.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <Link
                to="/treatments"
                className="group relative block rounded-2xl glass p-6 h-full hover:border-cyan/50 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-card opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="size-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <t.icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{t.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm text-cyan opacity-0 group-hover:opacity-100 transition">
                    Learn more <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { num: 10000, suffix: "+", label: "Patients Treated" },
    { num: 15, suffix: " Yrs", label: "Experience" },
    { num: 98, suffix: "%", label: "Satisfaction" },
    { num: 4.9, suffix: "★", label: "Google Rating", isFloat: true },
  ];
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass rounded-3xl p-10 sm:p-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-card opacity-50" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-display font-bold text-4xl sm:text-5xl text-gradient-primary">
                  {s.isFloat ? (
                    <span>{s.num}{s.suffix}</span>
                  ) : (
                    <CountUp to={s.num} suffix={s.suffix} />
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Doctor() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-primary opacity-25 blur-3xl rounded-full" />
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass">
            <img src={doctorImg} alt="Dr. Arjun Patel — Chief Medical Officer" loading="lazy" width={1024} height={1280} className="w-full h-full object-cover" />
          </div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -right-4 glass rounded-2xl p-4">
            <div className="text-xs text-muted-foreground">Credentials</div>
            <div className="font-display font-bold">BDS · MDS</div>
          </motion.div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-8 -left-4 glass rounded-2xl px-4 py-3">
            <div className="font-display font-bold text-lg">500+</div>
            <div className="text-xs text-muted-foreground">Surgeries</div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.25em] text-cyan font-accent">
            Meet your specialist
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 font-display font-bold text-3xl sm:text-5xl">
            Dr. Arjun Patel
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-2 text-cyan font-medium">
            Chief Medical Officer · Implantologist
          </motion.p>
          <motion.p variants={fadeUp} className="mt-6 text-muted-foreground leading-relaxed">
            With 15 years of clinical experience and over 500 successful surgeries, Dr. Patel
            blends surgical precision with the warmth of an old-world family physician. He
            leads a team of specialists trained at top global institutes.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-6 space-y-3">
            {[
              "Fellowship in Advanced Implantology — Germany",
              "Member, International Dental Federation",
              "Published 12+ papers in peer-reviewed journals",
            ].map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="size-4 mt-0.5 text-cyan shrink-0" /> {c}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-8">
            <Link to="/doctors" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-white">
              Meet the team <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const reviews = [
  { name: "Priya S.", text: "Felt like a five-star hotel, but the dentistry was world-class. Painless implant in one sitting.", treatment: "Dental Implants" },
  { name: "Rahul M.", text: "The booking experience alone is worth it. Doctors actually listened — rare these days.", treatment: "Skin Treatment" },
  { name: "Anjali V.", text: "I was nervous about my root canal. Dr. Patel made it the easiest 40 minutes of my month.", treatment: "Root Canal" },
  { name: "Karthik R.", text: "Three months post-PRP and my hair is visibly fuller. Honest staff, no upselling.", treatment: "PRP Hair" },
];

function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan font-accent">Patient stories</p>
          <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
            247 reviews. <span className="text-gradient-primary">4.9 stars.</span>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 hover:border-cyan/40 transition"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-cyan">{r.treatment}</div>
                </div>
                <div className="text-[10px] text-muted-foreground">✓ Verified</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/testimonials" className="inline-flex items-center gap-1.5 text-sm text-cyan hover:underline">
            See all 247 reviews <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BookingStrip() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl glass p-10 sm:p-16">
          <div className="absolute inset-0 bg-gradient-card opacity-60" />
          <div className="glow-orb size-[400px] -top-40 -right-20" style={{ background: "oklch(0.82 0.15 220 / 0.35)" }} />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan font-accent">Ready when you are</p>
              <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
                Book in <span className="text-gradient-primary">60 seconds</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Pick a time that works. We'll confirm via WhatsApp instantly and send a reminder
                24 hours before your visit.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-white">
                  <Calendar className="size-4" /> Start booking
                </Link>
                <a href="tel:+919999999999" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 font-semibold">
                  Call instead
                </a>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "Live availability — no double bookings",
                "WhatsApp confirmation within seconds",
                "Free reschedule up to 4 hours before",
                "Pay at the clinic, no online payment required",
              ].map((b) => (
                <div key={b} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
                  <CheckCircle2 className="size-5 text-cyan shrink-0" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
