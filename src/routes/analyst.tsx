import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { TrendChart } from "@/components/hppe/TrendChart";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/analyst")({
  head: () => ({
    meta: [
      { title: "Environmental Data Science & Prediction Lab · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Predictive atmospheric regression, diurnal industrial surge cycles, and air quality time-series analytics for Gujarat.",
      },
      { property: "og:title", content: "Environmental Data Science Lab · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/analyst" },
    ],
  }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(2500);
  const aqi = Math.round(readings.reduce((s, r) => s + r.aqi, 0) / readings.length);
  return (
    <PageShell path="/analyst" title="Prediction Lab" eyebrow="Environmental Analyst" icon={TrendingUp}
      description="Forecasting models, industrial risk scoring and seasonal pattern lab.">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Stat label="Next 6 h AQI Forecast" value={`${aqi + 12}`} />
        <Stat label="Surge Probability"     value="64%" />
        <Stat label="Industrial Risk Score" value="7.8 / 10" />
      </div>
      <TrendChart aqi={aqi} />
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums mt-1">{value}</div>
    </div>
  );
}