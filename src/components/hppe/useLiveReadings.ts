import { useEffect, useState } from "react";
import { generateSnapshot, type SensorReading } from "@/lib/hppe/data";
import { fetchStationByCity } from "@/lib/hppe/waqi";

// Each of our simulated nodes is mapped to a real WAQI station name so we
// can enrich the simulation with real AQI / pollutant data when available.
const NODE_CITY_MAP: Record<string, string> = {
  n1: "vapi",
  n2: "vapi",
  n3: "vapi",
  n4: "ankleshwar",
  n5: "ankleshwar",
  n6: "ahmedabad",
  n7: "ahmedabad",
};

let cachedLive: Record<string, { aqi: number; pm25?: number; so2?: number; humidity?: number; temperature?: number; windSpeed?: number; windDir?: number; ts: number }> = {};
let lastFetch = 0;
const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function refreshLive(): Promise<void> {
  const now = Date.now();
  if (now - lastFetch < FETCH_INTERVAL) return;
  lastFetch = now;
  const cities = Array.from(new Set(Object.values(NODE_CITY_MAP)));
  const results = await Promise.allSettled(cities.map((c) => fetchStationByCity(c)));
  const byCity: Record<string, any> = {};
  results.forEach((r, i) => {
    if (r.status === "fulfilled") byCity[cities[i]] = r.value;
  });
  const next: typeof cachedLive = {};
  for (const [nodeId, city] of Object.entries(NODE_CITY_MAP)) {
    const s = byCity[city];
    if (!s) continue;
    next[nodeId] = {
      aqi: s.aqi,
      pm25: s.iaqi?.pm25?.v,
      so2: s.iaqi?.so2?.v,
      humidity: s.iaqi?.h?.v,
      temperature: s.iaqi?.t?.v,
      windSpeed: s.iaqi?.w?.v,
      windDir: s.iaqi?.wd?.v,
      ts: now,
    };
  }
  if (Object.keys(next).length) cachedLive = next;
}

function mergeLive(snapshot: SensorReading[]): SensorReading[] {
  return snapshot.map((r) => {
    const live = cachedLive[r.id];
    if (!live) return r;
    return {
      ...r,
      aqi: live.aqi ?? r.aqi,
      pm25: live.pm25 ?? r.pm25,
      so2: live.so2 ?? r.so2,
      humidity: live.humidity ?? r.humidity,
      temperature: live.temperature ?? r.temperature,
      windSpeed: live.windSpeed ?? r.windSpeed,
      windDir: live.windDir ?? r.windDir,
    };
  });
}

export function useLiveReadings(intervalMs = 2500) {
  const [tick, setTick] = useState(1);
  const [readings, setReadings] = useState<SensorReading[]>(() => generateSnapshot(1));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    refreshLive()
      .then(() => mounted && (setLoading(false), setError(null)))
      .catch((e) => mounted && (setLoading(false), setError(e?.message ?? "Live data unavailable")));
    const id = setInterval(() => {
      setTick((t) => {
        const nt = t + 1;
        setReadings(mergeLive(generateSnapshot(nt)));
        return nt;
      });
      // Background-refresh live data on its own cadence.
      refreshLive().catch(() => {});
    }, intervalMs);
    return () => { mounted = false; clearInterval(id); };
  }, [intervalMs]);

  return { readings, tick, loading, error };
}