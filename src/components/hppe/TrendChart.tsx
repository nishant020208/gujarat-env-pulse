import { useEffect, useRef, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { SensorReading } from "@/lib/hppe/data";

export interface TrendChartProps {
  aqi?: number;
  selected?: SensorReading | null;
}

export function TrendChart({ aqi, selected }: TrendChartProps) {
  const currentAqi = typeof aqi === "number" ? aqi : selected?.aqi ?? 110;
  const [data, setData] = useState<{ t: string; aqi: number }[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({ t: String(i), aqi: 80 + Math.round(Math.random() * 50) }))
  );
  const ref = useRef(0);
  useEffect(() => {
    ref.current += 1;
    setData((d) => [...d.slice(1), { t: String(ref.current), aqi: currentAqi }]);
  }, [currentAqi]);

  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Network AQI · last 5 min</h3>
        <span className="text-[10px] font-mono uppercase tracking-widest text-primary">LIVE</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.20 165)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="oklch(0.82 0.20 165)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis tick={{ fill: "oklch(0.7 0.03 200)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "oklch(0.18 0.03 230)", border: "1px solid oklch(0.32 0.04 220)", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "oklch(0.7 0.03 200)" }}
          />
          <Area type="monotone" dataKey="aqi" stroke="oklch(0.82 0.20 165)" strokeWidth={2} fill="url(#g1)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}