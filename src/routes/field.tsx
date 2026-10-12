import { createFileRoute } from "@tanstack/react-router";
import { useState, useId } from "react";
import {
  Camera, Upload, MapPin, ShieldCheck, CheckCircle2, Crosshair,
  FileText, Activity, AlertTriangle, Layers, Clock, UserCheck
} from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { LiveMap, type FieldSamplePin } from "@/components/hppe/LiveMap";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/field")({
  head: () => ({
    meta: [
      { title: "Field Evidence Capture & Geotagged Inspection GIS · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Geotagged environmental evidence submission, field stack sampling GIS map, and GPCB statutory chain-of-custody log for Gujarat industrial corridors.",
      },
      { property: "og:title", content: "Field Evidence & Inspection GIS · Gujarat Environment Pulse" },
      { property: "og:description", content: "Submit geotagged pollution evidence, view live sampling stations and track industrial corridor inspections." },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/field" },
    ],
  }),
  component: FieldPage,
});

const INITIAL_FIELD_PINS: FieldSamplePin[] = [
  {
    id: "FS-2026-091",
    lat: 20.384,
    lng: 72.921,
    title: "Vapi Phase-II CETP Outlet #4",
    type: "Effluent Sampling",
    status: "verified",
    inspector: "S. Joshi (Badge #INSP-281)",
    timestamp: "Today, 09:42 AM",
  },
  {
    id: "FS-2026-092",
    lat: 21.628,
    lng: 73.012,
    title: "Ankleshwar GIDC Plot 410 Boiler Stack",
    type: "Stack Emission Gas",
    status: "pending",
    inspector: "V. Solanki (Badge #INSP-104)",
    timestamp: "Today, 11:15 AM",
  },
  {
    id: "FS-2026-093",
    lat: 21.722,
    lng: 72.595,
    title: "Dahej PCPIR Petrochem Flare Zone C",
    type: "VOC Ambient Canister",
    status: "verified",
    inspector: "M. Bhatt (Badge #INSP-198)",
    timestamp: "Yesterday, 04:30 PM",
  },
  {
    id: "FS-2026-094",
    lat: 21.092,
    lng: 72.871,
    title: "Sachin GIDC Textile Processing Line 2",
    type: "Particulate High-Volume Air",
    status: "escalated",
    inspector: "S. Joshi (Badge #INSP-281)",
    timestamp: "Yesterday, 06:10 PM",
  },
];

function FieldPage() {
  const { readings } = useLiveReadings();
  const [pins, setPins] = useState<FieldSamplePin[]>(INITIAL_FIELD_PINS);
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>([20.384, 72.921]);
  const [selectedPinId, setSelectedPinId] = useState<string>("FS-2026-091");

  // Form state
  const [cluster, setCluster] = useState("Vapi GIDC Industrial Area");
  const [sampleType, setSampleType] = useState("Stack Emission Gas");
  const [locationName, setLocationName] = useState("CETP Discharge Channel B");
  const [lat, setLat] = useState("20.3840");
  const [lng, setLng] = useState("72.9210");
  const [pm25, setPm25] = useState("142");
  const [voc, setVoc] = useState("2.4");
  const [notes, setNotes] = useState("Visible dark plume discharge recorded during afternoon shift transition. Heavy sulfur odor detected.");
  const [inspectorBadge, setInspectorBadge] = useState("INSP-GPCB-2026-88");
  const [fileName, setFileName] = useState<string | null>("FLIR_thermal_stack_vapi_0942.mp4");
  const [submitted, setSubmitted] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleMapClick = (clickLat: number, clickLng: number) => {
    setSelectedPoint([clickLat, clickLng]);
    setLat(clickLat.toFixed(5));
    setLng(clickLng.toFixed(5));
  };

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const cLat = Number(pos.coords.latitude.toFixed(5));
        const cLng = Number(pos.coords.longitude.toFixed(5));
        setLat(String(cLat));
        setLng(String(cLng));
        setSelectedPoint([cLat, cLng]);
        setGpsLoading(false);
      },
      () => {
        // Fallback to Ankleshwar coordinates
        setLat("21.62800");
        setLng("73.01200");
        setSelectedPoint([21.628, 73.012]);
        setGpsLoading(false);
      },
      { timeout: 6000 },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `FS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newPin: FieldSamplePin = {
      id: newId,
      lat: parseFloat(lat) || 21.3,
      lng: parseFloat(lng) || 72.95,
      title: `${cluster} - ${locationName}`,
      type: sampleType,
      status: "pending",
      inspector: `Inspector (Badge #${inspectorBadge})`,
      timestamp: "Just now",
    };

    setPins([newPin, ...pins]);
    setSelectedPinId(newId);
    setSelectedPoint([newPin.lat, newPin.lng]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <PageShell
      path="/field"
      title="Field Evidence Capture & Geotagged GIS"
      eyebrow="GSPCB Field Protocol"
      icon={Camera}
      description="Real-time field sampling GIS map, geotagged stack camera evidence, and statutory inspection logs for Gujarat industrial corridors."
    >
      <div className="space-y-6">

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 border border-border/50">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
              <span>Active Field Teams</span>
              <UserCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold mt-1 text-foreground">14 Units</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Surat, Bharuch & Valsad</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-border/50">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
              <span>Samples Logged Today</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold mt-1 text-foreground">{pins.length + 18} Records</div>
            <div className="text-[11px] text-sky-400 mt-0.5">100% Chain-of-Custody SHA256</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-border/50">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
              <span>Critical Exceedances</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold mt-1 text-amber-400">3 Verified</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Automated SCN Issued</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-border/50">
            <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
              <span>GIS Geotag Precision</span>
              <Crosshair className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold mt-1 text-foreground">± 2.4 Meters</div>
            <div className="text-[11px] text-primary mt-0.5">NavIC & GPS Synchronized</div>
          </div>
        </div>

        {/* Interactive Field GIS Map Section */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Gujarat Industrial Corridor Field GIS Map
              </h2>
              <p className="text-xs text-muted-foreground">
                Click anywhere on the map to place an inspection target pin or capture coordinates.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleUseCurrentGPS}
                disabled={gpsLoading}
                className="px-3 py-1.5 rounded-lg glass border border-primary/40 hover:bg-primary/10 text-primary font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Crosshair className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                {gpsLoading ? "Acquiring GPS…" : "Acquire Device GPS"}
              </button>
            </div>
          </div>

          <LiveMap
            readings={readings}
            height={520}
            fieldPins={pins}
            selectedPoint={selectedPoint}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Split Grid: Evidence Submission Form + Live Inspection Register */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7 glass-strong rounded-3xl p-6 sm:p-8 border border-border/50 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
              <div>
                <h3 className="text-lg font-bold">New Field Evidence Docket</h3>
                <p className="text-xs text-muted-foreground">
                  Statutory submission under Air (Prevention & Control of Pollution) Act, Sec 21
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-primary/20 grid place-items-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
            </div>

            {submitted && (
              <div className="mb-4 p-4 rounded-xl glass border border-emerald-500/40 text-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold">Evidence Logged Successfully</div>
                  <div>Geotagged coordinates pinned to the GIS ledger. Lab sample ID assigned.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">Industrial Cluster</span>
                  <select
                    value={cluster}
                    onChange={(e) => setCluster(e.target.value)}
                    className="mt-1 w-full bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="Vapi GIDC Industrial Area">Vapi GIDC (Chemical & Dyes)</option>
                    <option value="Ankleshwar GIDC Industrial Estate">Ankleshwar GIDC (Bulk Drugs)</option>
                    <option value="Dahej PCPIR Petrochemical Zone">Dahej PCPIR (Heavy Petrochemical)</option>
                    <option value="Sachin Industrial Estate">Sachin GIDC (Surat Synthetic)</option>
                    <option value="Panoli GIDC Industrial Belt">Panoli GIDC (Pesticides)</option>
                    <option value="Nandesari GIDC Complex">Nandesari GIDC (Vadodara)</option>
                    <option value="Vatva GIDC Ahmedabad">Vatva GIDC (Dyes & Intermediates)</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">Sample Classification</span>
                  <select
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    className="mt-1 w-full bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="Stack Emission Gas">Stack Emission Gas (Isokinetic)</option>
                    <option value="Effluent Sampling">ETP / CETP Discharge Effluent</option>
                    <option value="VOC Ambient Canister">Ambient VOC Summa Canister</option>
                    <option value="Particulate High-Volume Air">Particulate High-Volume Air (PM2.5/PM10)</option>
                    <option value="Hazardous Waste Sludge">Hazardous Waste Leaching Core</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-[11px] font-mono uppercase text-muted-foreground">Exact Spot / Facility Name</span>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="mt-1 w-full bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  placeholder="e.g. Unit 4 Common Stack Flue or Drain Gate 3"
                  required
                />
              </label>

              {/* Geotag coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">Latitude (N)</span>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="mt-1 w-full font-mono bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">Longitude (E)</span>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="mt-1 w-full font-mono bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                    required
                  />
                </label>
              </div>

              {/* In-situ field readings */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">In-situ PM2.5 (µg/m³)</span>
                  <input
                    type="number"
                    value={pm25}
                    onChange={(e) => setPm25(e.target.value)}
                    className="mt-1 w-full font-mono bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground">VOC Gas Sniffer (ppm)</span>
                  <input
                    type="text"
                    value={voc}
                    onChange={(e) => setVoc(e.target.value)}
                    className="mt-1 w-full font-mono bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  />
                </label>
              </div>

              {/* Evidence Upload Box */}
              <div>
                <span className="text-[11px] font-mono uppercase text-muted-foreground block mb-1">
                  Optical / Sensor Evidence Attachment
                </span>
                <div className="glass rounded-2xl p-5 border-2 border-dashed border-border/60 text-center hover:border-primary/50 transition">
                  <Upload className="w-8 h-8 mx-auto text-primary mb-2 opacity-80" />
                  <div className="text-xs font-semibold text-foreground">
                    {fileName ? (
                      <span className="text-primary font-mono">{fileName}</span>
                    ) : (
                      "Drop geotagged photos, FLIR video, or CSV logs here"
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Accepts JPG, PNG, MP4, CSV, PDF up to 64MB · SHA-256 seal generated automatically
                  </div>
                  <label className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium cursor-pointer transition">
                    Browse Evidence Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFileName(file.name);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Notes */}
              <label className="block">
                <span className="text-[11px] font-mono uppercase text-muted-foreground">Inspector Observations</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 w-full bg-background/50 border border-border/60 rounded-xl p-2.5 text-xs text-foreground outline-none focus:border-primary"
                  placeholder="Describe emission plumes, wind direction, stack condition, smell, or unapproved bypass valves..."
                />
              </label>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Badge: {inspectorBadge}</span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-xs glow hover:opacity-95 transition cursor-pointer"
                >
                  Record Geotagged Evidence Pin
                </button>
              </div>
            </form>
          </div>

          {/* Active Field Sample Registry */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-strong rounded-3xl p-6 border border-border/50 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
                <div>
                  <h3 className="text-base font-bold">Active Corridor Samples</h3>
                  <div className="text-xs text-muted-foreground">Geotagged sampling chain-of-custody</div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/20 text-primary">
                  {pins.length} Records
                </span>
              </div>

              <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                {pins.map((p) => {
                  const isSelected = selectedPinId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPinId(p.id);
                        setSelectedPoint([p.lat, p.lng]);
                      }}
                      className={`p-3.5 rounded-2xl glass border transition cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border/40 hover:border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-foreground">{p.title}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">{p.type}</div>
                        </div>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            p.status === "verified"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : p.status === "escalated"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border/20 pt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {p.timestamp ?? "Today"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Statutory Compliance Notice Box */}
            <div className="glass rounded-2xl p-5 border border-border/50 text-xs space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Statutory Evidence Evidentiary Value
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All field captures include GPS metadata, UTC hardware timestamping, and SHA-256 integrity hashing to satisfy Indian Evidence Act Section 65B requirements for National Green Tribunal (NGT) and GPCB hearing admissibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}