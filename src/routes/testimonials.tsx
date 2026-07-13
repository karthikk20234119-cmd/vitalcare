import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/testimonials")({
  head: () => ({ meta: [{ title: "Reviews — VitalCare" }, { name: "description", content: "247 verified Google reviews. Real stories from real patients." }] }),
  component: () => (
    <PageShell
      eyebrow="Reviews"
      title={<>247 reviews. <span className="text-gradient-primary">4.9 stars.</span></>}
      subtitle="Verified Google reviews, video testimonials, and real before/after transformations."
    />
  ),
});
