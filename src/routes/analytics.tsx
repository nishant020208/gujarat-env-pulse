import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { TrendChart } from "@/components/hppe/TrendChart";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { aqiCategory } from "@/lib/hppe/data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Air Quality Time-Series Analytics · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Longitudinal particulate concentration trends, seasonal diurnal variances, and corridor-wide environmental intelligence analytics for Gujarat.",
      },
      { property: "og:title", content: "Air Quality Time-Series Analytics · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/analytics" },
    ],
  }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(2500);
  const aqi = Math.round(readings.reduce((s, r) => s + r.aqi, 0) / readings.length);
  const peak = Math.max(...readings.map((r) => r.aqi));
  const peakNode = readings.find((r) => r.aqi === peak)?.name ?? "—";
  return (
    <PageShell path="/analytics" title="Analytics" eyebrow="Intelligence" icon={BarChart3}
      description="Trend modelling, peak emission hours and seasonal pattern analytics.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card label="Network AQI" value={String(aqi)} tone={aqiCategory(aqi).color} />
        <Card label="Peak Reading" value={`${peak} · ${peakNode}`} tone={aqiCategory(peak).color} />
        <Card label="Surge Probability (next 6h)" value={`${Math.min(94, 30 + Math.round(aqi / 4))}%`} tone="oklch(0.78 0.20 60)" />
      </div>
      <TrendChart aqi={aqi} />
    </PageShell>
  );
}

function Card({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold tabular-nums mt-1" style={{ color: tone }}>{value}</div>
    </div>
  );
}