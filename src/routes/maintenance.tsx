import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance Bay · HPEE" }] }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(3000);
  const queue = readings.filter((r) => !r.online || r.battery < 30);
  return (
    <PageShell path="/maintenance" title="Maintenance Bay" eyebrow="Field Engineering" icon={Wrench}
      description="Fault detection, calibration queue and dispatch workflow for sensor mesh.">
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold mb-3">Repair Queue · {queue.length} nodes</h3>
        {queue.length === 0 && <div className="text-sm text-muted-foreground py-8 text-center">Mesh is healthy — no dispatch required.</div>}
        {queue.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/30">
            <div>
              <div className="font-medium text-sm">{r.name}</div>
              <div className="text-xs text-muted-foreground">{!r.online ? "Offline" : `Battery ${r.battery}%`}</div>
            </div>
            <button className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground">Dispatch Team</button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}