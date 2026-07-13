import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <section className="relative bg-hero overflow-hidden -mt-20 pt-32 pb-20">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="glow-orb size-[400px] -top-32 -left-32" style={{ background: "oklch(0.66 0.20 255 / 0.4)" }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-cyan"
          >
            <Sparkles className="size-3.5" /> {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 font-display font-bold tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 max-w-2xl text-muted-foreground text-lg"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          {children ?? <ComingSoon />}
        </div>
      </section>
    </>
  );
}

function ComingSoon() {
  return (
    <div className="glass rounded-3xl p-12 text-center max-w-2xl mx-auto">
      <h2 className="font-display font-bold text-2xl">This page is being built</h2>
      <p className="mt-3 text-muted-foreground">
        We're rolling out content for this section in the next phase. In the meantime,
        feel free to book an appointment or get in touch.
      </p>
      <div className="mt-6 flex justify-center gap-3 flex-wrap">
        <Link to="/book" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white">
          Book Appointment <ArrowRight className="size-4" />
        </Link>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-semibold">
          Contact us
        </Link>
      </div>
    </div>
  );
}
