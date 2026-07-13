import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Gallery — VitalCare" }, { name: "description", content: "Take a tour of our clinic, equipment, and patient transformations." }] }),
  component: () => (
    <PageShell
      eyebrow="Gallery"
      title={<>Step <span className="text-gradient-primary">inside</span>.</>}
      subtitle="A look at our clinic, equipment, and patient transformations."
    />
  ),
});
