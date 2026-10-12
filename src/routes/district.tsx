import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { VILLAGES, aqiCategory } from "@/lib/hppe/data";

export const Route = createFileRoute("/district")({
  head: () => ({
    meta: [
      { title: "District Collectorate Environmental Oversight · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "District magistrate environmental monitoring portal for Valsad, Bharuch, Surat, and Ahmedabad overseeing industrial estate compliance.",
      },
      { property: "og:title", content: "District Environmental Oversight · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/district" },
    ],
  }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(3000);
  const districts = Array.from(new Set(VILLAGES.map((v) => v.district)));
  return (
    <PageShell path="/district" title="District Monitoring" eyebrow="Regional" icon={Globe}
      description="District-wide comparison, sensor coverage and incident heatmap.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {districts.map((d) => {
          const villageIds = VILLAGES.filter((v) => v.district === d).map((v) => v.id);
          const rs = readings.filter((r) => villageIds.includes(r.villageId));
          const aqi = rs.length ? Math.round(rs.reduce((s, r) => s + r.aqi, 0) / rs.length) : 0;
          const cat = aqiCategory(aqi);
          return (
            <div key={d} className="glass rounded-2xl p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">District</div>
              <h3 className="text-xl font-bold mt-1">{d}</h3>
              <div className="text-4xl font-bold tabular-nums mt-3" style={{ color: cat.color }}>{aqi}</div>
              <div className="text-xs text-muted-foreground mt-1">{cat.label} · {rs.length} sensors · {villageIds.length} villages</div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}