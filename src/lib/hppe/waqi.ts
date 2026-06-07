const TOKEN = (import.meta.env.VITE_WAQI_API_KEY as string | undefined) ?? "c00532e841c729e1d6ccd623bdaf69ebc66d9c3c";
const BASE = "https://api.waqi.info";

export interface WaqiStation {
  uid: number;
  aqi: number;
  station: { name: string; geo: [number, number]; time?: string };
  iaqi: {
    pm25?: { v: number };
    pm10?: { v: number };
    so2?: { v: number };
    no2?: { v: number };
    o3?: { v: number };
    co?: { v: number };
    h?: { v: number };   // humidity
    t?: { v: number };   // temp
    w?: { v: number };   // wind speed m/s
    wd?: { v: number };  // wind direction degrees
    p?: { v: number };   // pressure
  };
}

async function jget<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WAQI ${res.status}`);
  const body = await res.json();
  if (body.status !== "ok") throw new Error(`WAQI status ${body.status}`);
  return body.data as T;
}

export async function fetchStationByCity(city: string): Promise<WaqiStation> {
  const raw = await jget<any>(`${BASE}/feed/${encodeURIComponent(city)}/?token=${TOKEN}`);
  return {
    uid: raw.idx,
    aqi: typeof raw.aqi === "number" ? raw.aqi : parseInt(raw.aqi, 10) || 0,
    station: { name: raw.city?.name ?? city, geo: raw.city?.geo ?? [0, 0], time: raw.time?.s },
    iaqi: raw.iaqi ?? {},
  };
}

export async function searchStations(keyword: string) {
  const res = await fetch(`${BASE}/search/?token=${TOKEN}&keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error(`WAQI search ${res.status}`);
  const body = await res.json();
  return (body.data ?? []) as Array<{ uid: number; aqi: string; station: { name: string; geo: [number, number] } }>;
}

export const WAQI_TOKEN = TOKEN;