import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/treatments")({
  head: () => ({ meta: [{ title: "Treatments — VitalCare" }, { name: "description", content: "Precision dentistry, dermatology, hair, and physiotherapy under one roof." }] }),
  component: () => (
    <PageShell
      eyebrow="Treatments"
      title={<>Care for every part of <span className="text-gradient-primary">you</span>.</>}
      subtitle="Browse the full catalogue of treatments we offer — from cosmetic to clinical."
    />
  ),
});
