import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — VitalCare" }, { name: "description", content: "Reach us by phone, email, or WhatsApp. Open 7 days. Emergency 24/7." }] }),
  component: ContactPage,
});

function ContactPage() {
  const items = [
    { icon: Phone, label: "Call", value: "+91 99999 99999", href: "tel:+919999999999" },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat instantly", href: "https://wa.me/919999999999" },
    { icon: Mail, label: "Email", value: "hello@vitalcare.health", href: "mailto:hello@vitalcare.health" },
    { icon: MapPin, label: "Visit", value: "123 Health Avenue, India", href: "#" },
  ];
  return (
    <PageShell
      eyebrow="Contact"
      title={<>Let's <span className="text-gradient-primary">talk</span>.</>}
      subtitle="We're open 7 days a week. Emergency support available 24/7."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <a key={it.label} href={it.href} className="glass rounded-2xl p-6 hover:border-cyan/50 transition group">
            <div className="size-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <it.icon className="size-5 text-white" />
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{it.label}</div>
            <div className="mt-1 font-display font-semibold">{it.value}</div>
          </a>
        ))}
      </div>
    </PageShell>
  );
}
