import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Nav } from "@/components/hppe/Nav";
import { useAuth } from "@/components/hppe/useAuth";
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
import { Map, Camera, FileText, Bell, Building2, Radio } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center · Gujarat Environment Pulse (HPPE) | GPCB" },
      {
        name: "description",
        content: "Live CAAQMS sensor telemetry, AI plume source attribution, and GPCB statutory complaint docket generation across Gujarat industrial corridors.",
      },
      { property: "og:title", content: "Command Center · Gujarat Environment Pulse" },
      { property: "og:description", content: "Real-time environmental intelligence and industrial monitoring for Gujarat." },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/dashboard" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthed) navigate({ to: "/login" });
  }, [isAuthed, navigate]);

  const { readings } = useLiveReadings(2500);
  const [selectedId, setSelectedId] = useState<string>("n6"); // Vatva-Lake by default
  const selected = readings.find((r) => r.id === selectedId) ?? readings[0];

  const networkAqi = useMemo(
    () => Math.round(readings.reduce((s, r) => s + r.aqi, 0) / (readings.length || 1)),
    [readings]
  );
  const cat = aqiCategory(networkAqi);
  const surge = readings.filter((r) => r.aqi > 200).length;
  const offline = readings.filter((r) => !r.online).length;

  return (
    <div className="min-h-screen pt-20">
      <Nav />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 pb-12">
        {/* Breadcrumb Navigation */}
        <div className="pt-2 pb-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Public Portal</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Command Center</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header strip */}
        <div className="flex flex-wrap items-end justify-between gap-4 mt-3 mb-6">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-primary">// Real-Time Environmental Operations</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-foreground">
              Gujarat Industrial Corridor Operations Console
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Vapi · Sarigam · Ankleshwar · Jhagadia · Dahej · Sachin · Vatva · {readings.length} continuous CAAQMS stations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid grid-cols-3 gap-2">
              <KPI label="Network AQI" value={String(networkAqi)} tone={cat.color} />
              <KPI label="Surge Nodes" value={String(surge)} tone="oklch(0.78 0.20 60)" />
              <KPI label="Offline" value={String(offline)} tone={offline > 0 ? "oklch(0.68 0.25 25)" : "oklch(0.7 0.03 200)"} />
            </div>
          </div>
        </div>

        {/* Quick Link Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-2xl glass border border-border/40 text-xs">
          <span className="text-[10px] font-mono uppercase text-muted-foreground mr-1">Quick Modules:</span>
          <Link to="/map" className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 hover:text-primary transition flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5" /> Full GIS Map
          </Link>
          <Link to="/field" className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 hover:text-primary transition flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" /> Field Evidence GIS
          </Link>
          <Link to="/complaints" className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 hover:text-primary transition flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> GPCB Dockets
          </Link>
          <Link to="/alerts" className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 hover:text-primary transition flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" /> Surge Alerts
          </Link>
          <Link to="/industries" className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 hover:text-primary transition flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> Industrial Belts
          </Link>
          <Link to="/sensors" className="px-3 py-1.5 rounded-lg glass hover:bg-primary/20 hover:text-primary transition flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" /> Sensor Nodes
          </Link>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Map + sensors */}
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <ClientOnly fallback={<div className="rounded-2xl glass h-[520px] flex items-center justify-center text-muted-foreground text-sm">Initializing GIS telemetry…</div>}>
              <LiveMap readings={readings} height={520} />
            </ClientOnly>

            <div className="glass rounded-2xl p-5 border border-border/40">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Continuous Sensor Network</h2>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Select a station to focus
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {readings.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className="text-left w-full focus:outline-none cursor-pointer"
                  >
                    <SensorCard r={r} active={r.id === selected?.id} />
                  </button>
                ))}
              </div>
            </div>

            <TrendChart selected={selected} />
          </div>

          {/* Side panels */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            {selected && (
              <SourceInference
                key={selected.id}
                r={selected}
                reading={selected}
                readings={readings}
              />
            )}
            <AlertFeed readings={readings} />
            {selected && <ComplaintGenerator reading={selected} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="glass rounded-xl px-3 py-2 text-center border border-border/40 min-w-[80px]">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-bold mt-0.5 tabular-nums" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}