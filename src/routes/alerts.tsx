import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { AlertFeed } from "@/components/hppe/AlertFeed";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { aqiCategory } from "@/lib/hppe/data";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Critical Pollution Surge Alerts & Early Warnings · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Real-time industrial pollution surge alarms, threshold breach feeds, and multi-tier public health advisories across Gujarat.",
      },
      { property: "og:title", content: "Pollution Surge Alerts · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/alerts" },
    ],
  }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(2500);
  const tiers = [
    { label: "Hazardous", min: 400 },
    { label: "Severe",    min: 300 },
    { label: "Very Poor", min: 200 },
    { label: "Poor",      min: 100 },
  ];
  return (
    <PageShell path="/alerts" title="Pollution Alerts" eyebrow="Threshold Engine" icon={Bell}
      description="Real-time surge & threshold breach feed across the sensor mesh.">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 space-y-3">
          {tiers.map((t) => {
            const count = readings.filter((r) => r.aqi >= t.min && r.aqi < t.min + 100).length;
            return (
              <div key={t.label} className="glass rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t.label}</div>
                  <div className="text-2xl font-bold">{count}</div>
                </div>
                <div className="w-10 h-10 rounded-full" style={{ background: aqiCategory(t.min).color, opacity: 0.7 }} />
              </div>
            );
          })}
        </div>
        <div className="col-span-12 lg:col-span-8">
          <AlertFeed readings={readings} />
        </div>
      </div>
    </PageShell>
  );
}