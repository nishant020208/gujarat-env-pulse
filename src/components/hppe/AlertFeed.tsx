import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Activity, Radio } from "lucide-react";
import { aqiCategory, type SensorReading } from "@/lib/hppe/data";

export function AlertFeed({ readings }: { readings: SensorReading[] }) {
  const events = (readings || [])
    .filter((r) => (r?.aqi ?? 0) > 150 || !r?.online)
    .slice(0, 6)
    .map((r) => {
      const aqiVal = r?.aqi ?? 0;
      const pm25Val = r?.pm25 ?? 0;
      const windVal = r?.windDir ?? 180;
      const nameVal = r?.name || "Station";
      return {
        id: (r?.id || "node") + "-" + (r?.timestamp || Date.now()),
        title: !r?.online ? `Node offline: ${nameVal}` : `${aqiCategory(aqiVal).label} air at ${nameVal}`,
        severity: !r?.online ? "warn" : aqiVal > 300 ? "critical" : "alert",
        meta: `AQI ${aqiVal} · PM2.5 ${pm25Val} µg/m³ · wind ${windVal}°`,
      };
    });

  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Incident Feed</h3>
        </div>
        <span className="text-[10px] font-mono uppercase text-muted-foreground">{events.length} active</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        <AnimatePresence>
          {events.length === 0 && (
            <div className="text-xs text-muted-foreground py-6 text-center">
              <Activity className="w-5 h-5 mx-auto mb-2 opacity-50" />
              All sensors nominal.
            </div>
          )}
          {events.map((e) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-background/40 border border-border/40"
            >
              <AlertTriangle
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${e.severity === "critical" ? "text-destructive" : "text-[oklch(0.78_0.20_60)]"}`}
              />
              <div className="text-xs flex-1">
                <div className="font-medium">{e.title}</div>
                <div className="text-muted-foreground font-mono mt-0.5">{e.meta}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}