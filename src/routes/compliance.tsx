import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { INDUSTRIES } from "@/lib/hppe/data";

export const Route = createFileRoute("/compliance")({
  head: () => ({ meta: [{ title: "Compliance · HPEE" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell path="/compliance" title="Compliance Scoring" eyebrow="ESG · Regulatory" icon={ShieldCheck}
      description="Industrial compliance scoring against GSPCB & CPCB standards.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INDUSTRIES.map((i, idx) => {
          const score = 60 + ((idx * 17) % 35);
          return (
            <div key={i.id} className="glass rounded-2xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.type}</div>
                </div>
                <div className="text-3xl font-bold tabular-nums" style={{ color: score > 80 ? "oklch(0.82 0.20 145)" : score > 65 ? "oklch(0.78 0.20 80)" : "oklch(0.68 0.25 25)" }}>{score}</div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}