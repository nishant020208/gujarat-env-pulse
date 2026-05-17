import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { SourceInference } from "@/components/hppe/SourceInference";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { classifySource } from "@/lib/hppe/data";
import { useState } from "react";

export const Route = createFileRoute("/inference")({
  head: () => ({ meta: [{ title: "AI Inference Center · HPEE" }] }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(3000);
  const [idx, setIdx] = useState(0);
  const r = readings[idx % readings.length];
  if (!r) return null;
  const classes = classifySource(r);
  return (
    <PageShell path="/inference" title="AI Inference Center" eyebrow="Source Reasoning" icon={Brain}
      description="Wind-vector and shift-correlation analysis to infer probable emission source.">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 space-y-3">
          <div className="flex flex-wrap gap-2">
            {readings.map((rr, i) => (
              <button key={rr.id} onClick={() => setIdx(i)}
                className={`px-2.5 py-1 rounded-lg text-xs glass ${idx === i ? "border-primary" : ""}`}>{rr.name}</button>
            ))}
          </div>
          <SourceInference r={r} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3">Industrial vs Other Sources</h3>
            <div className="space-y-3">
              {classes.map((c) => (
                <div key={c.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{c.label}</span>
                    <span className="font-mono tabular-nums">{(c.probability * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${c.probability * 100}%` }} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">{c.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}