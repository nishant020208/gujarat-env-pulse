// Simulation data for Hyperlocal Pollution Evidence Engine

export interface Village {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  population: number;
  sarpanch: string;
}

export interface IndustrialCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  activeShift: boolean;
}

export const VILLAGES: Village[] = [
  { id: "v1", name: "Sarigam", district: "Valsad", lat: 20.479, lng: 72.892, population: 6420, sarpanch: "Rameshbhai Patel" },
  { id: "v2", name: "Karvad", district: "Valsad", lat: 20.413, lng: 72.918, population: 4150, sarpanch: "Manjuben Desai" },
  { id: "v3", name: "Piraman", district: "Bharuch", lat: 21.625, lng: 72.945, population: 5230, sarpanch: "Jayeshbhai Vasava" },
  { id: "v4", name: "Jhagadia", district: "Bharuch", lat: 21.733, lng: 73.143, population: 7820, sarpanch: "Hasmukhbhai Tadvi" },
  { id: "v5", name: "Vatva Gam", district: "Ahmedabad", lat: 22.957, lng: 72.628, population: 9120, sarpanch: "Ashaben Parmar" },
];

export const INDUSTRIES: IndustrialCluster[] = [
  { id: "i1", name: "Vapi GIDC Cluster", lat: 20.371, lng: 72.905, type: "Chemical & Dyes", activeShift: true },
  { id: "i2", name: "Sarigam GIDC", lat: 20.452, lng: 72.872, type: "Pharma & Specialty Chemicals", activeShift: true },
  { id: "i3", name: "Ankleshwar GIDC", lat: 21.625, lng: 73.005, type: "Bulk Drugs & Intermediates", activeShift: true },
  { id: "i4", name: "Jhagadia Industrial Estate", lat: 21.748, lng: 73.118, type: "Petrochem & Polymers", activeShift: false },
  { id: "i5", name: "Vatva GIDC Phase IV", lat: 22.948, lng: 72.642, type: "Dye & Pigment", activeShift: true },
];

export interface SensorReading {
  id: string;
  villageId: string;
  name: string;
  lat: number;
  lng: number;
  pm25: number;
  so2: number;
  aqi: number;
  windSpeed: number;
  windDir: number; // degrees, meteorological (from)
  humidity: number;
  temperature: number;
  battery: number;
  online: boolean;
  timestamp: number;
}

const NODE_DEFS = [
  { id: "n1", villageId: "v1", name: "Sarigam-North", lat: 20.483, lng: 72.889 },
  { id: "n2", villageId: "v1", name: "Sarigam-School", lat: 20.476, lng: 72.896 },
  { id: "n3", villageId: "v2", name: "Karvad-Center", lat: 20.413, lng: 72.918 },
  { id: "n4", villageId: "v3", name: "Piraman-PHC", lat: 21.625, lng: 72.948 },
  { id: "n5", villageId: "v4", name: "Jhagadia-Chowk", lat: 21.733, lng: 73.143 },
  { id: "n6", villageId: "v5", name: "Vatva-Lake", lat: 22.957, lng: 72.628 },
  { id: "n7", villageId: "v5", name: "Vatva-Market", lat: 22.961, lng: 72.633 },
];

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

export function generateSnapshot(tick: number): SensorReading[] {
  return NODE_DEFS.map((n, i) => {
    const r = seeded(tick * 7 + i * 31);
    const surge = r() < 0.18 ? 1 : 0; // occasional surge
    const basePm = 35 + r() * 80 + surge * 180;
    const pm25 = Math.round(basePm);
    const so2 = Math.round(8 + r() * 25 + surge * 60);
    const aqi = Math.min(500, Math.round(pm25 * 2.1 + so2 * 1.4));
    return {
      ...n,
      pm25,
      so2,
      aqi,
      windSpeed: +(2 + r() * 7).toFixed(1),
      windDir: Math.round(180 + Math.sin(tick / 6 + i) * 90),
      humidity: Math.round(45 + r() * 35),
      temperature: +(26 + r() * 8).toFixed(1),
      battery: Math.round(60 + r() * 39),
      online: r() > 0.04,
      timestamp: Date.now(),
    };
  });
}

export function aqiCategory(aqi: number) {
  if (aqi <= 50) return { label: "Good", color: "oklch(0.82 0.20 145)", tone: "good" as const };
  if (aqi <= 100) return { label: "Moderate", color: "oklch(0.85 0.18 95)", tone: "moderate" as const };
  if (aqi <= 200) return { label: "Poor", color: "oklch(0.78 0.20 60)", tone: "poor" as const };
  if (aqi <= 300) return { label: "Very Poor", color: "oklch(0.70 0.25 30)", tone: "very-poor" as const };
  if (aqi <= 400) return { label: "Severe", color: "oklch(0.62 0.28 18)", tone: "severe" as const };
  return { label: "Hazardous", color: "oklch(0.55 0.30 350)", tone: "hazardous" as const };
}

export function inferSource(reading: SensorReading): {
  bearing: number; // 0-360, direction toward source
  industry: IndustrialCluster | null;
  confidence: number;
  reasoning: string[];
} {
  // Wind direction is "from" — source is upwind, so bearing = windDir
  const bearing = reading.windDir % 360;
  // Find nearest industry roughly upwind
  const candidates = INDUSTRIES.map((ind) => {
    const dy = ind.lat - reading.lat;
    const dx = ind.lng - reading.lng;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dx, dy) * 180) / Math.PI;
    const norm = (angle + 360) % 360;
    const delta = Math.min(Math.abs(norm - bearing), 360 - Math.abs(norm - bearing));
    const score = (1 / (dist + 0.01)) * Math.max(0, 1 - delta / 90) * (ind.activeShift ? 1 : 0.4);
    return { ind, dist, delta, score };
  }).sort((a, b) => b.score - a.score);

  const best = candidates[0];
  const aqiBoost = Math.min(1, reading.aqi / 350);
  const windBoost = Math.min(1, reading.windSpeed / 8);
  const confidence = Math.round(Math.min(0.97, 0.35 + best.score * 0.4 + aqiBoost * 0.25 + windBoost * 0.15) * 100);
  return {
    bearing,
    industry: best?.ind ?? null,
    confidence,
    reasoning: [
      `Wind from ${bearing}° at ${reading.windSpeed} m/s carries plume from upwind sector`,
      `Nearest active industrial cluster: ${best.ind.name} (${best.ind.type})`,
      `Bearing alignment Δ ${Math.round(best.delta)}° within tolerance`,
      `PM2.5 surge of ${reading.pm25} µg/m³ correlates with active shift window`,
    ],
  };
}

export function classifySource(reading: SensorReading): { label: string; probability: number; reason: string }[] {
  const so2Ratio = reading.so2 / (reading.pm25 + 1);
  const industrial = Math.min(0.95, 0.4 + so2Ratio * 1.2 + reading.aqi / 800);
  const cropBurn = Math.max(0.02, 0.3 - so2Ratio * 0.6 + (reading.temperature > 30 ? 0.15 : 0));
  const dust = Math.max(0.02, 0.2 + (reading.humidity < 50 ? 0.2 : -0.05));
  const vehicle = Math.max(0.05, 0.18);
  const total = industrial + cropBurn + dust + vehicle;
  return [
    { label: "Industrial Emission", probability: industrial / total, reason: "Elevated SO₂:PM₂.₅ ratio characteristic of combustion stacks" },
    { label: "Crop / Biomass Burning", probability: cropBurn / total, reason: "Lower SO₂ signature, organic carbon dominant" },
    { label: "Construction Dust", probability: dust / total, reason: "Coarse-fraction PM, low humidity amplifies suspension" },
    { label: "Vehicular", probability: vehicle / total, reason: "Background NOx contribution near transport corridors" },
  ].sort((a, b) => b.probability - a.probability);
}