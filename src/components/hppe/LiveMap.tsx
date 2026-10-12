import { Fragment, useEffect, useState } from "react";
import { INDUSTRIES, VILLAGES, aqiCategory, type SensorReading } from "@/lib/hppe/data";
import { Layers, MapPin, Compass, Eye } from "lucide-react";

export interface FieldSamplePin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: string;
  status: string;
  inspector?: string;
  timestamp?: string;
}

interface Props {
  readings?: SensorReading[];
  height?: number | string;
  focusVillageId?: string;
  fieldPins?: FieldSamplePin[];
  selectedPoint?: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
  showIndustrialClusters?: boolean;
}

export function LiveMap({
  readings = [],
  height = 500,
  focusVillageId,
  fieldPins = [],
  selectedPoint,
  onMapClick,
  showIndustrialClusters = true,
}: Props) {
  const [mapLib, setMapLib] = useState<null | typeof import("react-leaflet")>(null);
  const [tileMode, setTileMode] = useState<"dark" | "osm">("dark");

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
    : selectedPoint
    ? selectedPoint
    : [21.4, 72.9];

  if (!mapLib) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-border/50 glass" style={{ height }}>
        <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <div className="font-mono text-xs">Loading Gujarat GIS Layers…</div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip, Circle, Polyline, useMap, useMapEvents } = mapLib;

  function MapResizer() {
    const map = useMap();
    useEffect(() => {
      const t = setTimeout(() => {
        map.invalidateSize();
      }, 200);
      return () => clearTimeout(t);
    }, [map]);
    return null;
  }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (onMapClick) {
          onMapClick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
        }
      },
    });
    return null;
  }

  function MapCenterSync() {
    const map = useMap();
    useEffect(() => {
      if (selectedPoint) {
        map.setView(selectedPoint, Math.max(map.getZoom(), 11));
      }
    }, [map]);
    return null;
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border/50 glass shadow-xl" style={{ height }}>
      <MapContainer
        center={center}
        zoom={9}
        style={{ height: "100%", width: "100%", background: "#0b1219" }}
        scrollWheelZoom
      >
        <MapResizer />
        <MapClickHandler />
        <MapCenterSync />

        {tileMode === "dark" ? (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            maxZoom={19}
          />
        )}

        {/* Selected target marker from user click */}
        {selectedPoint && (
          <CircleMarker
            center={selectedPoint}
            radius={12}
            pathOptions={{ color: "#38bdf8", fillColor: "#0284c7", fillOpacity: 0.9, weight: 3 }}
          >
            <Tooltip permanent direction="top">
              <span className="font-bold text-xs text-sky-400">Target Field Pin: {selectedPoint[0]}, {selectedPoint[1]}</span>
            </Tooltip>
          </CircleMarker>
        )}

        {/* Industrial Clusters and stacks */}
        {showIndustrialClusters &&
          INDUSTRIES.map((ind) => (
            <CircleMarker
              key={ind.id}
              center={[ind.lat, ind.lng]}
              radius={9}
              pathOptions={{
                color: ind.activeShift ? "#ff6b3d" : "#64748b",
                fillColor: ind.activeShift ? "#ea580c" : "#475569",
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Tooltip>
                <div className="text-xs font-sans">
                  <div className="font-bold text-sm text-foreground">{ind.name}</div>
                  <div className="text-muted-foreground">{ind.type} · GIDC Sector</div>
                  <div className="mt-1 flex items-center gap-1.5 font-mono">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        ind.activeShift ? "bg-emerald-500" : "bg-zinc-500"
                      }`}
                    />
                    <span>{ind.activeShift ? "Active Shift Operation" : "Maintenance / Idle"}</span>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Field sampling points */}
        {fieldPins.map((pin) => (
          <CircleMarker
            key={pin.id}
            center={[pin.lat, pin.lng]}
            radius={8}
            pathOptions={{
              color: pin.status === "verified" ? "#10b981" : "#f59e0b",
              fillColor: pin.status === "verified" ? "#059669" : "#d97706",
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Tooltip direction="top">
              <div className="text-xs font-sans">
                <div className="font-bold text-foreground">{pin.title}</div>
                <div className="text-muted-foreground">Type: {pin.type}</div>
                <div className="text-muted-foreground">Inspector: {pin.inspector ?? "Field Officer"}</div>
                <div className="text-primary font-mono text-[10px] mt-0.5">Status: {pin.status.toUpperCase()}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

        {/* Sensor readings with plume vectors */}
        {readings.map((r) => {
          const cat = aqiCategory(r.aqi);
          const radius = 600 + r.aqi * 10;
          const windRad = ((r.windDir + 180) % 360) * (Math.PI / 180);
          const dLat = (Math.cos(windRad) * (r.aqi / 50)) / 100;
          const dLng = (Math.sin(windRad) * (r.aqi / 50)) / 100;
          return (
            <Fragment key={r.id}>
              <Circle
                center={[r.lat, r.lng]}
                radius={radius}
                pathOptions={{ color: cat.color, fillColor: cat.color, fillOpacity: 0.2, weight: 1 }}
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
                radius={7}
                pathOptions={{ color: cat.color, fillColor: cat.color, fillOpacity: 1, weight: 2 }}
              >
                <Tooltip direction="top">
                  <div className="text-xs font-sans">
                    <strong className="text-sm font-semibold">{r.name}</strong>
                    <div className="mt-1 flex items-center gap-1.5 font-mono">
                      <span className="font-bold text-foreground">AQI {r.aqi}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold" style={{ backgroundColor: cat.color, color: "#000" }}>
                        {cat.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      PM2.5: {r.pm25} µg/m³ · PM10: {r.pm10} µg/m³
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Wind: {r.windDir}° @ {r.windSpeed} m/s
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>

      {/* Layer selector & controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 glass rounded-lg p-1 text-xs">
        <button
          type="button"
          onClick={() => setTileMode("dark")}
          className={`px-2.5 py-1 rounded-md transition ${
            tileMode === "dark" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Carto Dark
        </button>
        <button
          type="button"
          onClick={() => setTileMode("osm")}
          className={`px-2.5 py-1 rounded-md transition ${
            tileMode === "osm" ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          OSM Standard
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute top-3 left-3 z-[400] glass-strong rounded-xl px-3.5 py-2.5 text-xs font-mono space-y-1.5 backdrop-blur-md shadow-lg">
        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">// GIS Corridor Overlay</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b3d]" /> GIDC Industrial Complex
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Continuous CAAQMS Station
        </div>
        {fieldPins.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Geotagged Field Sample
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary opacity-40" /> Plume Dispersion
        </div>
      </div>
    </div>
  );
}