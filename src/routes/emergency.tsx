import { createFileRoute } from "@tanstack/react-router";
import { Siren, Megaphone, Radio, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { useState } from "react";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency Center · HPEE" }] }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(2500);
  const surge = readings.filter((r) => r.aqi > 200);
  const [sent, setSent] = useState(false);

  return (
    <PageShell path="/emergency" title="Emergency Response Center" eyebrow="Crisis Control" icon={Siren}
      description="Hazard broadcasts, evacuation notices and real-time alert dispatch.">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <div className="glass-strong rounded-2xl p-6 border-l-4" style={{ borderLeftColor: surge.length ? "oklch(0.68 0.25 25)" : "oklch(0.82 0.20 165)" }}>
            <div className="flex items-center gap-3">
              <ShieldAlert className={`w-6 h-6 ${surge.length ? "text-destructive" : "text-primary"}`} />
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Status</div>
                <div className="text-xl font-bold">{surge.length ? `${surge.length} active hazard zones` : "All clear"}</div>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {surge.length === 0 && <li className="text-muted-foreground">No nodes currently above the hazard threshold.</li>}
              {surge.map((r) => (
                <li key={r.id} className="flex justify-between p-2 rounded bg-background/40 border border-border/40">
                  <span>{r.name}</span>
                  <span className="font-mono text-destructive">AQI {r.aqi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 space-y-3">
          <button
            onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
            className="w-full p-4 rounded-2xl bg-destructive text-destructive-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Megaphone className="w-5 h-5" /> {sent ? "Broadcast Dispatched" : "Trigger Emergency Broadcast"}
          </button>
          <button className="w-full p-4 rounded-2xl glass-strong font-semibold flex items-center justify-center gap-2">
            <Radio className="w-5 h-5 text-primary" /> Issue Village Evacuation Notice
          </button>
        </div>
      </div>
    </PageShell>
  );
}