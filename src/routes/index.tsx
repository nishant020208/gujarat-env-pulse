import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, Wind, FileText, MapPin, Brain, ShieldCheck, Radio, Zap, ArrowRight, Gauge, Factory, Satellite,
} from "lucide-react";
import { Nav } from "@/components/hppe/Nav";
import { ClientOnly } from "@/components/hppe/ClientOnly";
import { LiveMap } from "@/components/hppe/LiveMap";
import { SensorCard } from "@/components/hppe/SensorCard";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hyperlocal Pollution Evidence Engine · Gujarat" },
      { name: "description", content: "Real-time pollution detection, AI source inference, and one-click GSPCB Form-A complaints for villages near Vapi, Ankleshwar, and Vatva." },
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
      <LiveDemo />
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
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono uppercase tracking-widest text-primary mb-6"
        >
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-primary" />
          Live · Gujarat industrial corridor
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.05]"
        >
          Catch the pollution<br />
          <span className="text-gradient">district stations miss.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl"
        >
          A hyperlocal sensor mesh + AI source-inference engine that hands Gujarat villages a
          legally-formatted <span className="text-foreground font-medium">GSPCB Form-A complaint in under 60 seconds</span>.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-wrap gap-3 mt-8"
        >
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold flex items-center gap-2 glow"
          >
            Launch Command Center <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#live"
            className="px-6 py-3 rounded-xl glass text-foreground font-medium hover:bg-secondary/40 transition"
          >
            See live evidence
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14 max-w-3xl">
          {[
            { v: "47", l: "Villages monitored" },
            { v: "192", l: "Sensor nodes" },
            { v: "2.3s", l: "Median telemetry" },
            { v: "58s", l: "Complaint dispatch" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-xl p-4">
              <div className="text-3xl font-bold text-gradient tabular-nums">{s.v}</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Strip() {
  const items = ["GSPCB-aligned", "CPCB AQI scale", "Section 31A · Air Act 1981", "Tamper-evident SHA-256", "Gujarati + English"];
  return (
    <div className="border-y border-border/40 py-4 overflow-hidden glass">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs font-mono uppercase tracking-widest text-muted-foreground px-6">
        {items.map((i) => <span key={i}>{i}</span>)}
      </div>
    </div>
  );
}

const MODULES = [
  { icon: Radio, title: "Real-time sensor mesh", body: "PM2.5, SO₂, AQI, wind vectors and node health streamed every 2.5s with pulsing live indicators." },
  { icon: MapPin, title: "Hyperlocal pollution map", body: "Dark-mode GIS with plume animation, industrial overlays, sensor coverage, and timeline scrub." },
  { icon: Brain, title: "AI source inference", body: "Wind vectors + active-shift schedules + spike correlation produce a probable upwind cluster with confidence." },
  { icon: Factory, title: "Industrial vs ag classifier", body: "Distinguishes stack emissions from biomass burns, dust, and vehicular signatures." },
  { icon: FileText, title: "GSPCB Form-A in 60s", body: "Auto-generated, geo-stamped, QR-verifiable PDF ready for dispatch via WhatsApp or email." },
  { icon: ShieldCheck, title: "Evidence timeline", body: "Forensic-grade log of pollution rise, wind shift, and industrial overlap for legal proceedings." },
  { icon: Gauge, title: "Surge alert system", body: "Emergency siren, WhatsApp broadcast, and child/elderly-specific advisories above thresholds." },
  { icon: Satellite, title: "Predictive analytics", body: "Hourly AQI forecast, peak-emission windows, and seasonal industrial-surge probability." },
];

function Modules() {
  return (
    <section id="modules" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">// Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Eight engines, one cockpit.</h2>
          <p className="text-muted-foreground mt-4">
            Each module operates independently and ties into a unified evidence package the moment a surge is detected.
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
              className="glass rounded-2xl p-5 hover:border-primary/40 transition group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <m.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold mb-1.5">{m.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{m.body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Sensor mesh streams", d: "Battery-powered nodes across village schools, PHCs and chowks push readings every 2.5s." },
    { n: "02", t: "AI infers the source", d: "Wind vectors meet industrial shift schedules to nominate the upwind cluster with confidence." },
    { n: "03", t: "Form-A auto-compiles", d: "Evidence, geo-coords, and reasoning seal into a GSPCB-formatted PDF with QR verification." },
    { n: "04", t: "Inspector dispatched", d: "Tracking ID returned. WhatsApp + email reach the right desk at the regional office." },
  ];
  return (
    <section id="how" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">// Pipeline</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">From plume to paperwork — automatically.</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4 relative">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-2xl p-6">
              <div className="text-5xl font-bold text-gradient tabular-nums mb-3">{s.n}</div>
              <div className="font-semibold">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-2">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveDemo() {
  const { readings } = useLiveReadings(3000);
  return (
    <section id="live" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">// Live preview</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Real telemetry, right now.</h2>
          </div>
          <Link to="/dashboard" className="text-sm text-primary font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all">
            Open full command center <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ClientOnly fallback={<div className="rounded-2xl glass h-[480px] flex items-center justify-center text-muted-foreground text-sm">Initializing GIS…</div>}>
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
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto glass-strong rounded-3xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative">
          <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            File your first complaint in <span className="text-gradient">under a minute</span>.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Open the command center, pick an affected sensor node, and download a GSPCB-ready PDF.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold glow"
          >
            Launch Command Center <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span>HPEE · Hyperlocal Pollution Evidence Engine</span>
        </div>
        <div className="font-mono">© 2026 · Built for Gujarat villages · Aligned with GSPCB & CPCB norms</div>
      </div>
    </footer>
  );
}
