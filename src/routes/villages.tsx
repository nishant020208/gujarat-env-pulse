import { createFileRoute } from "@tanstack/react-router";
import { Home, Users } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { VILLAGES, aqiCategory } from "@/lib/hppe/data";

export const Route = createFileRoute("/villages")({
  head: () => ({
    meta: [
      { title: "Monitored Villages & Gram Panchayat Index · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Index of vulnerable settlements, PHCs, schools and gram panchayats situated downwind of Gujarat industrial corridors.",
      },
      { property: "og:title", content: "Monitored Villages Index · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/villages" },
    ],
  }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(3000);
  return (
    <PageShell path="/villages" title="Village Registry" eyebrow="Operations" icon={Home}
      description="Per-village air quality, population exposure and sarpanch contacts.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {VILLAGES.map((v) => {
          const vReadings = readings.filter((r) => r.villageId === v.id);
          const aqi = vReadings.length ? Math.round(vReadings.reduce((s, r) => s + r.aqi, 0) / vReadings.length) : 0;
          const cat = aqiCategory(aqi);
          return (
            <div key={v.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{v.district}</div>
                  <h3 className="text-lg font-semibold">{v.name}</h3>
                </div>
                <div className="text-3xl font-bold tabular-nums" style={{ color: cat.color }}>{aqi}</div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> {v.population.toLocaleString()} residents · Sarpanch {v.sarpanch}
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <div className="h-full" style={{ width: `${Math.min(100, aqi / 5)}%`, background: cat.color }} />
              </div>
              <div className="mt-3 text-[11px] text-muted-foreground">{vReadings.length} sensor nodes online</div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}