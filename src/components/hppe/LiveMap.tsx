import { Fragment, useEffect, useState } from "react";
import { INDUSTRIES, VILLAGES, aqiCategory, type SensorReading } from "@/lib/hppe/data";

interface Props {
  readings: SensorReading[];
  height?: number | string;
  focusVillageId?: string;
}

export function LiveMap({ readings, height = 480, focusVillageId }: Props) {
  const [mapLib, setMapLib] = useState<null | typeof import("react-leaflet")>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    Promise.all([import("react-leaflet"), import("leaflet")])
      .then(([reactLeaflet, leafletModule]) => {
        if (cancelled) return;

        const leaflet = ((leafletModule as unknown as { default?: typeof import("leaflet") }).default ?? leafletModule) as typeof import("leaflet");
        delete (leaflet.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        setMapLib(reactLeaflet);
      })
      .catch((error) => {
        console.error("Failed to initialize live map", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const center: [number, number] = focusVillageId
    ? (() => {
        const v = VILLAGES.find((v) => v.id === focusVillageId);
        return v ? [v.lat, v.lng] : [21.3, 72.95];
      })()
    : [21.3, 72.95];

  if (!mapLib) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-border/50 glass" style={{ height }}>
        <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">Initializing GIS…</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip, Circle, Polyline } = mapLib;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/50 glass" style={{ height }}>
      <MapContainer center={center} zoom={9} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {INDUSTRIES.map((ind) => (
          <CircleMarker
            key={ind.id}
            center={[ind.lat, ind.lng]}
            radius={9}
            pathOptions={{
              color: ind.activeShift ? "#ff6b3d" : "#888",
              fillColor: ind.activeShift ? "#ff6b3d" : "#555",
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Tooltip>
              <strong>{ind.name}</strong>
              <br />
              {ind.type}
              <br />
              Shift: {ind.activeShift ? "ACTIVE" : "Idle"}
            </Tooltip>
          </CircleMarker>
        ))}
        {readings.map((r) => {
          const cat = aqiCategory(r.aqi);
          const radius = 600 + r.aqi * 10;
          const windRad = ((r.windDir + 180) % 360) * (Math.PI / 180); // toward
          const dLat = (Math.cos(windRad) * (r.aqi / 50)) / 100;
          const dLng = (Math.sin(windRad) * (r.aqi / 50)) / 100;
          return (
            <Fragment key={r.id}>
              <Circle
                center={[r.lat, r.lng]}
                radius={radius}
                pathOptions={{ color: cat.color, fillColor: cat.color, fillOpacity: 0.18, weight: 1 }}
              />
              <Polyline
                positions={[
                  [r.lat, r.lng],
                  [r.lat + dLat, r.lng + dLng],
                ]}
                pathOptions={{ color: cat.color, weight: 2, dashArray: "4 6" }}
              />
              <CircleMarker
                center={[r.lat, r.lng]}
                radius={6}
                pathOptions={{ color: cat.color, fillColor: cat.color, fillOpacity: 1, weight: 2 }}
              >
                <Tooltip direction="top">
                  <strong>{r.name}</strong>
                  <br />
                  AQI: {r.aqi} ({cat.label})
                  <br />
                  PM2.5: {r.pm25} µg/m³
                  <br />
                  Wind: {r.windDir}° @ {r.windSpeed} m/s
                </Tooltip>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>
      <div className="absolute top-3 left-3 z-[400] glass-strong rounded-lg px-3 py-2 text-xs font-mono space-y-1">
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ff6b3d]" /> Active GIDC Cluster</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" /> Sensor Node</div>
        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary opacity-30" /> Pollution Plume</div>
      </div>
    </div>
  );
}