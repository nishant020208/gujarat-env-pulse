import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Wrench, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/maintenance-mode")({
  head: () => ({
    meta: [
      { title: "Scheduled System Maintenance · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Platform scheduled telemetry maintenance. Real-time CAAQMS sensor ingestion continues uninterrupted.",
      },
      { property: "og:title", content: "Scheduled System Maintenance · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/maintenance-mode" },
    ],
  }),
  component: () => (
    <div className="min-h-screen grid place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-10 max-w-lg w-full text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 grid place-items-center mb-5">
          <Wrench className="w-7 h-7 text-amber-300" />
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">// Scheduled maintenance</div>
        <h1 className="text-2xl font-bold mt-2">Platform under maintenance</h1>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          The HPEE platform is undergoing scheduled maintenance. Live sensor ingestion continues in the background and will resume on the console shortly.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Return home
        </Link>
      </motion.div>
    </div>
  ),
});