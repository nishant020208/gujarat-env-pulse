import { motion } from "framer-motion";
import { aqiCategory, type SensorReading } from "@/lib/hppe/data";
import { Wind, Droplets, Thermometer, Battery, Wifi, WifiOff } from "lucide-react";

export function SensorCard({ r }: { r: SensorReading }) {
  const cat = aqiCategory(r.aqi);
  return (
    <motion.div
      layout
      className="glass rounded-2xl p-4 relative overflow-hidden"
      style={{ boxShadow: `0 0 30px ${cat.color}22` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5" style={{ background: cat.color }} />
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{r.id.toUpperCase()}</div>
          <div className="text-sm font-semibold">{r.name}</div>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: cat.color }}>
          <span className="pulse-dot w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
          {r.online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 text-destructive" />}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold tabular-nums" style={{ color: cat.color }}>{r.aqi}</div>
        <div className="text-xs uppercase tracking-wider" style={{ color: cat.color }}>{cat.label}</div>
      </div>
      <div className="text-[11px] text-muted-foreground font-mono mt-0.5">AQI · PM2.5 {r.pm25} µg/m³ · SO₂ {r.so2}</div>
      <div className="grid grid-cols-4 gap-2 mt-4 text-[11px]">
        <Metric icon={<Wind className="w-3 h-3" />} label={`${r.windSpeed}m/s`} sub={`${r.windDir}°`} />
        <Metric icon={<Droplets className="w-3 h-3" />} label={`${r.humidity}%`} sub="RH" />
        <Metric icon={<Thermometer className="w-3 h-3" />} label={`${r.temperature}°`} sub="C" />
        <Metric icon={<Battery className="w-3 h-3" />} label={`${r.battery}%`} sub="bat" />
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