import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [{ title: "Activity Log · HPEE" }] }),
  component: Page,
});

const LOG = [
  { t: "12:42:18", who: "inspector@gspcb",  action: "Opened case GSPCB/2026/A-1042" },
  { t: "12:39:02", who: "system",            action: "Auto-generated Form-A for Vatva-Lake surge (AQI 312)" },
  { t: "12:31:47", who: "sarpanch@sarigam",  action: "Acknowledged advisory broadcast" },
  { t: "12:18:09", who: "maintenance@field", action: "Replaced battery on Sarigam-School" },
  { t: "12:02:33", who: "industry@vapi",     action: "Submitted May shift schedule" },
];

function Page() {
  return (
    <PageShell path="/activity" title="Activity Log" eyebrow="Audit Trail" icon={Activity}
      description="Tamper-evident log of every platform action.">
      <div className="glass rounded-2xl overflow-hidden font-mono text-xs">
        {LOG.map((e, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-border/30">
            <div className="col-span-2 text-muted-foreground">{e.t}</div>
            <div className="col-span-3 text-primary">{e.who}</div>
            <div className="col-span-7">{e.action}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}