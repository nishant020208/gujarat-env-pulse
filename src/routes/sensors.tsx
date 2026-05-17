import { createFileRoute } from "@tanstack/react-router";
import { Radio, BatteryFull, Wifi, WifiOff } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/sensors")({
  head: () => ({ meta: [{ title: "Sensor Network · HPEE" }] }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(2500);
  return (
    <PageShell path="/sensors" title="Sensor Network" eyebrow="Field Telemetry" icon={Radio}
      description="Mesh health, battery, calibration and dispatch queue.">
      <div className="overflow-x-auto glass rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr className="border-b border-border/40">
              <th className="text-left p-3">Node</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">PM2.5</th>
              <th className="text-right p-3">SO₂</th>
              <th className="text-right p-3">AQI</th>
              <th className="text-right p-3">Battery</th>
              <th className="text-right p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.id} className="border-b border-border/20 hover:bg-muted/20">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3">
                  {r.online ? (
                    <span className="inline-flex items-center gap-1.5 text-primary text-xs"><Wifi className="w-3.5 h-3.5" /> Online</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-destructive text-xs"><WifiOff className="w-3.5 h-3.5" /> Offline</span>
                  )}
                </td>
                <td className="p-3 text-right tabular-nums">{r.pm25}</td>
                <td className="p-3 text-right tabular-nums">{r.so2}</td>
                <td className="p-3 text-right tabular-nums font-semibold">{r.aqi}</td>
                <td className="p-3 text-right">
                  <span className="inline-flex items-center gap-1 text-xs"><BatteryFull className="w-3.5 h-3.5 text-primary" />{r.battery}%</span>
                </td>
                <td className="p-3 text-right">
                  <button className="text-xs px-2 py-1 rounded glass hover:border-primary/60">Dispatch</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}