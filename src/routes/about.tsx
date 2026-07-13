import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — VitalCare" }, { name: "description", content: "15 years of clinical excellence, world-class infrastructure, and a team that treats you like family." }] }),
  component: () => (
    <PageShell
      eyebrow="About VitalCare"
      title={<>15 years of <span className="text-gradient-primary">clinical excellence</span>.</>}
      subtitle="A premium digital-first clinic blending precision medicine with genuine human warmth."
    />
  ),
});
