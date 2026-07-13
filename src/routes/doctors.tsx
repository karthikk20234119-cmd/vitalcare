import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "Doctors — VitalCare" }, { name: "description", content: "Meet our team of specialists trained at top global institutes." }] }),
  component: () => (
    <PageShell
      eyebrow="Our doctors"
      title={<>Specialists you can <span className="text-gradient-primary">trust</span>.</>}
      subtitle="Globally trained, locally rooted. Browse profiles and book directly with your doctor of choice."
    />
  ),
});
