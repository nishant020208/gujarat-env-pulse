import { createFileRoute } from "@tanstack/react-router";
import { Camera, Upload } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";

export const Route = createFileRoute("/field")({
  head: () => ({ meta: [{ title: "Field Uploads · HPEE" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell path="/field" title="Field Uploads" eyebrow="Evidence Capture" icon={Camera}
      description="Upload site photographs, sensor logs and stack samples from the field.">
      <div className="glass-strong rounded-2xl p-10 text-center max-w-2xl mx-auto border-2 border-dashed border-border/60">
        <Upload className="w-10 h-10 mx-auto text-primary mb-3" />
        <div className="font-semibold">Drop evidence files here</div>
        <div className="text-xs text-muted-foreground mt-1">Images, video, CSV sensor exports or PDF inspection notes</div>
        <button className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Choose files</button>
      </div>
    </PageShell>
  );
}