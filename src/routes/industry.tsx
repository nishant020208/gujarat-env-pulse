import { createFileRoute } from "@tanstack/react-router";
import { Upload, Factory } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { INDUSTRIES } from "@/lib/hppe/data";

export const Route = createFileRoute("/industry")({
  head: () => ({ meta: [{ title: "Industry Console · HPEE" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell path="/industry" title="Industry Compliance Console" eyebrow="Industry" icon={Factory}
      description="Submit shift schedules, boiler logs and environmental compliance disclosures.">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-3">My Units</h3>
          {INDUSTRIES.slice(0, 3).map((i) => (
            <div key={i.id} className="flex justify-between items-center py-3 border-b border-border/30">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.type}</div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-primary/15 text-primary">Compliant</span>
            </div>
          ))}
        </div>
        <div className="col-span-12 lg:col-span-5 glass-strong rounded-2xl p-5 text-center">
          <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="font-semibold">Upload shift schedule</div>
          <div className="text-xs text-muted-foreground mt-1">CSV / XLSX · monthly</div>
          <button className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Choose file</button>
        </div>
      </div>
    </PageShell>
  );
}