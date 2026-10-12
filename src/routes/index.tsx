import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, Wind, FileText, MapPin, Brain, ShieldCheck, Radio, Zap, ArrowRight, Gauge, Factory, Satellite, Map, Camera, Phone, ShieldAlert
} from "lucide-react";
import { Nav } from "@/components/hppe/Nav";
import { ClientOnly } from "@/components/hppe/ClientOnly";
import { LiveMap } from "@/components/hppe/LiveMap";
import { SensorCard } from "@/components/hppe/SensorCard";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gujarat Environment Pulse · Hyperlocal Pollution Evidence Engine (HPPE) | GPCB" },
      {
        name: "description",
        content: "Continuous ambient air quality monitoring (CAAQMS), industrial emission telemetry, and automated GPCB statutory complaint docket generation for Gujarat industrial corridors.",
      },
      { property: "og:title", content: "Gujarat Environment Pulse · HPPE Portal" },
      { property: "og:description", content: "State of Gujarat continuous ambient air monitoring and statutory pollution evidence system." },
      { property: "og:url", content: "https://hppe.gujarat.gov.in" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Nav />
      <Hero />
      <Strip />
      <Modules />
      <HowItWorks />
      <LiveTelemetry />
      <Cta />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-6 grid-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-10 w-64 h-64 rounded-full bg-primary/20 blur-[100px] animate-float" />
        <div className="absolute top-48 right-10 w-80 h-80 rounded-full bg-accent/15 blur-[120px]" />
      </div>
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-6"
        >
          <span className="pulse-dot w-2 h-2 rounded-full bg-primary" />
          Statutory Telemetry · Gujarat Industrial Corridor Mesh
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.08]"
        >
          Continuous Industrial <br />
          <span className="text-gradient">Environmental Intelligence for Gujarat</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground mt-6 max-w-3xl leading-relaxed"
        >
          A state-of-the-art CAAQMS sensor mesh and Gaussian plume attribution engine providing Gujarat's district magistrates, field inspectors, and gram panchayats with
          legally formatted <span className="text-foreground font-semibold">GPCB statutory dockets and instant early warnings</span>.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-wrap items-center gap-3.5 mt-8"
        >
          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center gap-2 glow hover:opacity-95 transition"
          >
            Access Command Center <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/map"
            className="px-6 py-3.5 rounded-xl glass text-foreground font-medium hover:bg-secondary/40 transition flex items-center gap-2"
          >
            <Map className="w-4 h-4 text-primary" /> Open GIS Live Map
          </Link>
          <Link
            to="/field"
            className="px-6 py-3.5 rounded-xl glass text-foreground font-medium hover:bg-secondary/40 transition flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-primary" /> Field Uploads
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-14 max-w-3xl">
          {[
            { v: "47", l: "Villages Monitored" },
            { v: "192", l: "Sensor Nodes Active" },
            { v: "2.3s", l: "Telemetry Refresh" },
            { v: "100%", l: "Chain-of-Custody SHA-256" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-xl p-4 border border-border/40">
              <div className="text-2xl sm:text-3xl font-bold text-gradient tabular-nums">{s.v}</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-widest mt-1 font-mono">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Strip() {
  const items = [
    "Gujarat Pollution Control Board Aligned",
    "CPCB National Air Quality Index (NAAQS)",
    "Section 21/31A Air Act 1981 Enforceable",
    "SHA-256 Cryptographic Audit Ledger",
    "Gujarati + Hindi + English Telemetry",
  ];
  return (
    <div className="border-y border-border/40 py-4 overflow-hidden glass">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs font-mono uppercase tracking-widest text-muted-foreground px-6">
        {items.map((i) => <span key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />{i}</span>)}
      </div>
    </div>
  );
}

const MODULES = [
  { icon: Radio, title: "Continuous CAAQMS Mesh", body: "PM2.5, PM10, SO₂, NOx, VOCs, wind azimuth and telemetry streamed every 2.5s with microclimate drift compensation." },
  { icon: MapPin, title: "Statewide Industrial GIS", body: "High-resolution geospatial map with Gaussian plume dispersion, GIDC stack boundaries, and inspection zones." },
  { icon: Brain, title: "Source Attribution Model", body: "Wind vectors crossed with plant production shifts to mathematically trace pollution surges to originating stacks." },
  { icon: Factory, title: "Industrial Classification", body: "Distinguishes chemical stack flaring from agricultural crop burning and vehicular traffic emissions." },
  { icon: FileText, title: "Statutory GPCB Dockets", body: "One-click generation of court-ready show-cause notices and inspection dockets with tamper-evident QR seals." },
  { icon: Camera, title: "Field Evidence & Geotagging", body: "Mobile-optimized field sampling logger with GPS coords, FLIR thermal photo attachments, and lab custody logs." },
  { icon: Gauge, title: "Surge Alert Broadcast", body: "Early warning sirens and multi-lingual broadcast alerts delivered to local sarpanches before spikes reach villages." },
  { icon: Satellite, title: "District Collectorate Desk", body: "Aggregated compliance indices and automated show-cause issuance for Valsad, Bharuch, Surat, and Ahmedabad." },
];

function Modules() {
  return (
    <section id="modules" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">// Command Architecture</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Eight Specialized Operational Modules</h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base leading-relaxed">
            Integrated command environment uniting field enforcement, lab sampling, data science, and statutory administrative oversight.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5 hover:border-primary/40 transition group border border-border/40"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <m.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold text-base mb-1.5">{m.title}</div>
              <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{m.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Telemetry Ingestion", d: "High-precision optical laser particle counters in schools, PHCs and gram panchayats broadcast telemetry every 2.5s." },
    { n: "02", t: "Gaussian Plume Modeling", d: "Atmospheric vectors and meteorological wind models intersect with plant shift rosters to infer origin stacks." },
    { n: "03", t: "Statutory Seal Compilation", d: "Evidence, GPS coordinates, and historical spike curves seal into a digitally signed GPCB docket with QR verification." },
    { n: "04", t: "Enforcement Roster Dispatch", d: "Inspection mandates dispatch directly to the regional office (RO Vapi, RO Ankleshwar, RO Surat) with tracking code." },
  ];
  return (
    <section id="how" className="py-24 px-6 relative border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">// Regulatory Workflow</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">From Plume Inception to Regulatory Action</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6 border border-border/40">
              <div className="text-4xl font-bold text-gradient tabular-nums mb-3 font-mono">{s.n}</div>
              <div className="font-semibold text-base">{s.t}</div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveTelemetry() {
  const { readings } = useLiveReadings(3000);
  return (
    <section id="live" className="py-24 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// Continuous Stream</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Live Environmental Telemetry</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/map" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
              Expanded GIS Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold glow">
              Open Full Console
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ClientOnly fallback={<div className="rounded-2xl glass h-[480px] flex items-center justify-center text-muted-foreground text-sm">Initializing Gujarat GIS Layer…</div>}>
              <LiveMap readings={readings} height={480} />
            </ClientOnly>
          </div>
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {readings.slice(0, 5).map((r) => (
              <SensorCard key={r.id} r={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="py-24 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto glass-strong rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border border-border/50 shadow-2xl">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative">
          <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Generate Statutory Form-A Evidence in <span className="text-gradient">Under 60 Seconds</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Select an impacted sensor node, inspect plume vectors, and generate an authenticated GPCB statutory docket with digital SHA-256 seal.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold glow hover:opacity-95 transition"
            >
              Access Command Center
            </Link>
            <Link
              to="/field"
              className="px-6 py-3.5 rounded-xl glass text-foreground font-medium hover:bg-secondary/40 transition"
            >
              Field Evidence GIS
            </Link>
            <Link
              to="/complaints"
              className="px-6 py-3.5 rounded-xl glass text-foreground font-medium hover:bg-secondary/40 transition"
            >
              Statutory Complaints Docket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 px-6 mt-12 bg-background/50">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div>
            <div className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Gujarat Environment Pulse
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Hyperlocal Pollution Evidence Engine (HPPE) for the State of Gujarat. Continuous ambient monitoring for industrial clusters.
            </p>
          </div>
          <div>
            <div className="font-bold text-foreground mb-3 font-mono uppercase text-[11px]">Core Navigation</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary transition">Command Center</Link></li>
              <li><Link to="/map" className="hover:text-primary transition">Statewide GIS Map</Link></li>
              <li><Link to="/field" className="hover:text-primary transition">Field Evidence Uploads</Link></li>
              <li><Link to="/complaints" className="hover:text-primary transition">GPCB Complaints Docket</Link></li>
              <li><Link to="/alerts" className="hover:text-primary transition">Surge Alerts Console</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-foreground mb-3 font-mono uppercase text-[11px]">Monitoring Belts</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/industries" className="hover:text-primary transition">Vapi GIDC Industrial Belt</Link></li>
              <li><Link to="/industries" className="hover:text-primary transition">Ankleshwar Chemical Estate</Link></li>
              <li><Link to="/industries" className="hover:text-primary transition">Dahej PCPIR Petrochemical Zone</Link></li>
              <li><Link to="/industries" className="hover:text-primary transition">Sachin Industrial Corridor</Link></li>
              <li><Link to="/industries" className="hover:text-primary transition">Vatva & Naroda Clusters</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-foreground mb-3 font-mono uppercase text-[11px]">Official Resources</div>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/sensors" className="hover:text-primary transition">CAAQMS Station Directory</Link></li>
              <li><Link to="/reports" className="hover:text-primary transition">Compliance Reports Archive</Link></li>
              <li><Link to="/help" className="hover:text-primary transition">System Manual & Shortcuts</Link></li>
              <li><Link to="/login" className="hover:text-primary transition">Secure Officer Login</Link></li>
              <li className="text-[11px] text-primary flex items-center gap-1 pt-1 font-mono">
                <Phone className="w-3 h-3" /> GPCB: 1800-233-1234
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border/30 flex flex-wrap items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <div className="font-mono">
            © 2026 Gujarat Pollution Control Board & Department of Forests and Environment · Government of Gujarat
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px]">
            <span>NAAQS (2009) Aligned</span>
            <span>·</span>
            <span>Section 21 Air Act 1981</span>
            <span>·</span>
            <span>ISO 14001 Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
