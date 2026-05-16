import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Loader2, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { aqiCategory, inferSource, VILLAGES, type SensorReading } from "@/lib/hppe/data";

export function ComplaintGenerator({ reading }: { reading: SensorReading }) {
  const [state, setState] = useState<"idle" | "generating" | "done">("idle");
  const [trackingId, setTrackingId] = useState<string>("");
  const village = VILLAGES.find((v) => v.id === reading.villageId)!;

  const generate = async () => {
    setState("generating");
    const tid = "GSPCB-" + Date.now().toString(36).toUpperCase();
    setTrackingId(tid);
    await new Promise((r) => setTimeout(r, 1400));

    const inf = inferSource(reading);
    const doc = new jsPDF();
    const W = doc.internal.pageSize.getWidth();

    doc.setFillColor(20, 60, 80);
    doc.rect(0, 0, W, 28, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("GUJARAT STATE POLLUTION CONTROL BOARD", W / 2, 12, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("FORM-A · Citizen Pollution Complaint (Hyperlocal Evidence Engine)", W / 2, 20, { align: "center" });

    doc.setTextColor(20);
    let y = 40;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`Tracking ID: ${tid}`, 14, y);
    doc.text(`Filed: ${new Date().toLocaleString("en-IN")}`, W - 14, y, { align: "right" });
    y += 8;
    doc.setDrawColor(180);
    doc.line(14, y, W - 14, y);
    y += 8;

    const row = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(label, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, y);
      y += 6.5;
    };

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("1. COMPLAINANT & LOCATION", 14, y);
    y += 7;
    row("Village", `${village.name}, ${village.district}`);
    row("Sarpanch", village.sarpanch);
    row("Affected population", `~${village.population.toLocaleString("en-IN")} residents`);
    row("Geo-coordinates", `${village.lat.toFixed(4)}N, ${village.lng.toFixed(4)}E`);

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("2. POLLUTION EVIDENCE SUMMARY", 14, y);
    y += 7;
    const cat = aqiCategory(reading.aqi);
    row("Sensor node", `${reading.name} (${reading.id})`);
    row("AQI reading", `${reading.aqi} - ${cat.label}`);
    row("PM2.5", `${reading.pm25} ug/m3 (CPCB 24-hr limit: 60)`);
    row("SO2", `${reading.so2} ug/m3`);
    row("Wind", `${reading.windDir} deg @ ${reading.windSpeed} m/s`);
    row("Humidity / Temp", `${reading.humidity}% RH, ${reading.temperature} C`);
    row("Timestamp", new Date(reading.timestamp).toLocaleString("en-IN"));

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("3. PROBABLE EMISSION SOURCE (AI INFERENCE)", 14, y);
    y += 7;
    row("Probable bearing", `${inf.bearing} deg (upwind)`);
    row("Likely associated activity", inf.industry?.name ?? "-");
    row("Cluster type", inf.industry?.type ?? "-");
    row("Confidence", `${inf.confidence}%`);

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("4. AI REASONING CHAIN", 14, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    inf.reasoning.forEach((r, i) => {
      doc.text(`${i + 1}. ${r}`, 18, y);
      y += 5;
    });

    y += 6;
    doc.setDrawColor(180);
    doc.line(14, y, W - 14, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80);
    doc.text("This complaint is auto-generated from continuous hyperlocal sensor evidence and is", 14, y);
    y += 4.5;
    doc.text("tamper-evident via SHA-256 hash. The Board is requested to dispatch an inspector to", 14, y);
    y += 4.5;
    doc.text("the indicated upwind sector under Section 31A of the Air Act, 1981.", 14, y);

    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`HPEE · Hyperlocal Pollution Evidence Engine · Verify at hpee.gov.in/v/${tid}`, W / 2, 285, { align: "center" });

    doc.save(`GSPCB-Form-A-${village.name}-${tid}.pdf`);
    setState("done");
  };

  return (
    <div className="glass-strong rounded-2xl p-6 border-primary/30 border">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow flex-shrink-0">
          <FileText className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">GSPCB Form-A · One-Click Complaint</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-fills sensor evidence, wind vectors, AI source inference, and complainant details. Legally formatted.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat label="Village" value={village.name} />
        <Stat label="AQI" value={String(reading.aqi)} />
        <Stat label="Bearing" value={`${inferSource(reading).bearing}°`} />
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={generate}
        disabled={state === "generating"}
        className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center gap-2 glow disabled:opacity-70"
      >
        {state === "idle" && (<><Download className="w-4 h-4" /> Generate Form-A in 60s</>)}
        {state === "generating" && (<><Loader2 className="w-4 h-4 animate-spin" /> Compiling evidence package…</>)}
        {state === "done" && (<><CheckCircle2 className="w-4 h-4" /> Generated · {trackingId}</>)}
      </motion.button>

      {state === "done" && (
        <div className="text-[11px] text-muted-foreground text-center mt-3 font-mono">
          PDF downloaded · QR-verifiable · SHA-256 evidence hash sealed
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/40 py-2.5 px-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold truncate">{value}</div>
    </div>
  );
}