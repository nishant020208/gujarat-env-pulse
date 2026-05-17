import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, MapPin } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";

export const Route = createFileRoute("/inspector")({
  head: () => ({ meta: [{ title: "Inspection Desk · HPEE" }] }),
  component: Page,
});

const CASES = [
  { id: "GSPCB/2026/A-1042", village: "Sarigam",   stage: "Field visit scheduled", priority: "High" },
  { id: "GSPCB/2026/A-1039", village: "Karvad",    stage: "Awaiting evidence",     priority: "Medium" },
  { id: "GSPCB/2026/A-1037", village: "Piraman",   stage: "Sample collection",     priority: "High" },
];

function Page() {
  return (
    <PageShell path="/inspector" title="Inspection Desk" eyebrow="Field Operations" icon={ClipboardCheck}
      description="Assigned cases, evidence timeline and field workflow.">
      <div className="space-y-3">
        {CASES.map((c) => (
          <div key={c.id} className="glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{c.id}</div>
              <div className="font-semibold mt-0.5 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {c.village}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{c.stage}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${c.priority === "High" ? "bg-destructive/20 text-destructive" : "bg-muted/40"}`}>{c.priority}</span>
              <button className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground">Open Case</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}