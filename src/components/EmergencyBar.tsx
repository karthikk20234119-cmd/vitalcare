import { Phone, MessageCircle } from "lucide-react";

export function EmergencyBar() {
  return (
    <section className="relative overflow-hidden bg-gradient-emergency py-5">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 12px, transparent 12px 24px)",
      }} />
      <div className="relative mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <span className="text-2xl animate-pulse">🚨</span>
          <span className="font-display font-semibold text-lg">
            Medical Emergency? We're available 24/7
          </span>
        </div>
        <div className="flex gap-2">
          <a href="tel:+919999999999" className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition">
            <Phone className="size-4" /> +91 99999 99999
          </a>
          <a href="https://wa.me/919999999999" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-destructive hover:bg-white/90 transition">
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
