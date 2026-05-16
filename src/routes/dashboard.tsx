import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/hppe/Nav";
import { ClientOnly } from "@/components/hppe/ClientOnly";
import { LiveMap } from "@/components/hppe/LiveMap";
import { SensorCard } from "@/components/hppe/SensorCard";
import { SourceInference } from "@/components/hppe/SourceInference";
import { TrendChart } from "@/components/hppe/TrendChart";
import { AlertFeed } from "@/components/hppe/AlertFeed";
import { ComplaintGenerator } from "@/components/hppe/ComplaintGenerator";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { VILLAGES, aqiCategory } from "@/lib/hppe/data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center · HPEE" },
      { name: "description", content: "Live sensor mesh, AI source inference, and GSPCB Form-A generation for Gujarat industrial villages." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { readings } = useLiveReadings(2500);
  const [selectedId, setSelectedId] = useState<string>("n6"); // Vatva-Lake by default
  const selected = readings.find((r) => r.id === selectedId) ?? readings[0];

  const networkAqi = useMemo(
    () => Math.round(readings.reduce((s, r) => s + r.aqi, 0) / readings.length),
    [readings]
  );
  const cat = aqiCategory(networkAqi);
  const surge = readings.filter((r) => r.aqi > 200).length;
  const offline = readings.filter((r) => !r.online).length;

  return (
    <div className="min-h-screen pt-20">
      <Nav />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 pb-12">
        {/* Header strip */}
        <div className="flex flex-wrap items-end justify-between gap-4 mt-4 mb-6">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-primary">// Command Center</div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Gujarat Industrial Corridor · Live</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Vapi · Sarigam · Ankleshwar · Jhagadia · Vatva · {readings.length} active nodes
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <KPI label="Network AQI" value={String(networkAqi)} tone={cat.color} />
            <KPI label="Surge nodes" value={String(surge)} tone="oklch(0.78 0.20 60)" />
            <KPI label="Offline" value={String(offline)} tone={offline > 0 ? "oklch(0.68 0.25 25)" : "oklch(0.7 0.03 200)"} />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Map + sensors */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <ClientOnly fallback={<div className="rounded-2xl glass h-[520px] flex items-center justify-center text-muted-foreground text-sm">Initializing GIS…</div>}>
              <LiveMap readings={readings} height={520} />
            </ClientOnly>

            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Sensor Mesh</h2>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Tap a node to focus
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {readings.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`text-left transition ${selectedId === r.id ? "ring-2 ring-primary rounded-2xl" : ""}`}
                  >
                    <SensorCard r={r} />
                  </button>
                ))}
              </div>
            </div>

            <TrendChart aqi={networkAqi} />
          </div>

          {/* Right column */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-4"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Selected node</div>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="font-semibold text-lg">{selected.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {VILLAGES.find((v) => v.id === selected.villageId)?.name} ·{" "}
                    {VILLAGES.find((v) => v.id === selected.villageId)?.district}
                  </div>
                </div>
                <div className="text-3xl font-bold tabular-nums" style={{ color: aqiCategory(selected.aqi).color }}>
                  {selected.aqi}
                </div>
              </div>
            </motion.div>

            <SourceInference r={selected} />
            <ComplaintGenerator reading={selected} />
            <AlertFeed readings={readings} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="glass rounded-xl px-4 py-2.5 min-w-[110px]">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: tone }}>{value}</div>
    </div>
  );
}