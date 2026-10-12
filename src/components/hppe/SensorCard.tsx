import { motion } from "framer-motion";
import { aqiCategory, type SensorReading } from "@/lib/hppe/data";
import { Wind, Droplets, Thermometer, Battery, Wifi, WifiOff } from "lucide-react";

export function SensorCard({ r, active }: { r: SensorReading; active?: boolean }) {
  const aqiVal = typeof r?.aqi === "number" ? r.aqi : 50;
  const cat = aqiCategory(aqiVal);
  const windSpd = typeof r?.windSpeed === "number" ? r.windSpeed : 3.2;
  const windDr = typeof r?.windDir === "number" ? r.windDir : 180;
  const humidity = typeof r?.humidity === "number" ? r.humidity : 50;
  const temp = typeof r?.temperature === "number" ? r.temperature : 28;
  const bat = typeof r?.battery === "number" ? r.battery : 85;

  return (
    <motion.div
      layout
      className={`glass rounded-2xl p-4 relative overflow-hidden transition-all duration-200 ${
        active
          ? "ring-2 ring-primary/80 border-primary/60 shadow-lg shadow-primary/10"
          : "hover:border-primary/30"
      }`}
      style={{ boxShadow: active ? `0 0 25px ${cat.color}40` : `0 0 20px ${cat.color}15` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: cat.color }} />
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{(r?.id || "station").toUpperCase()}</div>
          <div className="text-sm font-semibold">{r?.name || "Regional Station"}</div>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: cat.color }}>
          <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
          {r?.online !== false ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 text-destructive" />}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold tabular-nums" style={{ color: cat.color }}>{aqiVal}</div>
        <div className="text-xs uppercase tracking-wider" style={{ color: cat.color }}>{cat.label}</div>
      </div>
      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">AQI · PM2.5 {r?.pm25 ?? 35} µg/m³ · SO₂ {r?.so2 ?? 15}</div>
      <div className="grid grid-cols-4 gap-2 mt-4 text-[11px]">
        <Metric icon={<Wind className="w-3 h-3" />} label={`${windSpd}m/s`} sub={`${windDr}°`} />
        <Metric icon={<Droplets className="w-3 h-3" />} label={`${humidity}%`} sub="RH" />
        <Metric icon={<Thermometer className="w-3 h-3" />} label={`${temp}°`} sub="C" />
        <Metric icon={<Battery className="w-3 h-3" />} label={`${bat}%`} sub="bat" />
      </div>
    </motion.div>
  );
}

function Metric({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg bg-background/40 border border-border/30">
      <div className="text-muted-foreground">{icon}</div>
      <div className="font-mono font-medium">{label}</div>
      <div className="text-[9px] text-muted-foreground uppercase">{sub}</div>
    </div>
  );
}