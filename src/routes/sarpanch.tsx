import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { VILLAGES, aqiCategory } from "@/lib/hppe/data";

export const Route = createFileRoute("/sarpanch")({
  head: () => ({
    meta: [
      { title: "Gram Panchayat Air Quality Advisory Desk · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Village-level air quality telemetry and health advisories for sarpanches across Sarigam, Piraman, Vatva Gam, and Jhagadia.",
      },
      { property: "og:title", content: "Gram Panchayat Advisory Desk · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/sarpanch" },
    ],
  }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(2500);
  const v = VILLAGES[0];
  const rs = readings.filter((r) => r.villageId === v.id);
  const aqi = rs.length ? Math.round(rs.reduce((s, r) => s + r.aqi, 0) / rs.length) : 0;
  const cat = aqiCategory(aqi);
  return (
    <PageShell path="/sarpanch" title={`Gram Panchayat — ${v.name}`} eyebrow="Sarpanch Console" icon={Users}
      description="Village AQI, health advisories and one-click complaint filing.">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5 glass-strong rounded-2xl p-6 text-center">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Current AQI · {v.name}</div>
          <div className="text-7xl font-bold tabular-nums my-3" style={{ color: cat.color }}>{aqi}</div>
          <div className="text-sm font-medium" style={{ color: cat.color }}>{cat.label} air quality</div>
          <div className="text-xs text-muted-foreground mt-2">Population {v.population.toLocaleString()} · Sarpanch {v.sarpanch}</div>
        </div>
        <div className="col-span-12 lg:col-span-7 glass rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-semibold">Health Advisory</h3>
          <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
            <li>Children and elderly should avoid outdoor activity until AQI {"<"} 100.</li>
            <li>Schools advised to keep windows closed during 10:00–14:00.</li>
            <li>N95 masks recommended for outdoor workers.</li>
          </ul>
          <button className="mt-3 w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium">File GSPCB Complaint</button>
        </div>
      </div>
    </PageShell>
  );
}