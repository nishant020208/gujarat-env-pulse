import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search, X, Command, FileText, Siren, Map as MapIcon, Download,
  ClipboardCheck, Zap, ChevronRight, Bell, Activity,
} from "lucide-react";
import { ROLES, tabsForRole, getRole, type RoleId } from "@/lib/hppe/roles";
import { useRole } from "./useRole";
import { useLiveReadings } from "./useLiveReadings";
import { aqiCategory } from "@/lib/hppe/data";

interface Props { open: boolean; onClose: () => void; }

export function CommandCenter({ open, onClose }: Props) {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { readings } = useLiveReadings(3500);

  const tabs = useMemo(() => tabsForRole(role), [role]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tabs;
    return tabs.filter(
      (t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.group.toLowerCase().includes(q),
    );
  }, [tabs, query]);
  const grouped = useMemo(() => {
    const m = new Map<string, typeof tabs>();
    filtered.forEach((t) => {
      const arr = m.get(t.group) ?? [];
      arr.push(t);
      m.set(t.group, arr);
    });
    return Array.from(m.entries());
  }, [filtered]);

  const networkAqi = readings.length
    ? Math.round(readings.reduce((s, r) => s + r.aqi, 0) / readings.length)
    : 0;
  const cat = aqiCategory(networkAqi);
  const surge = readings.filter((r) => r.aqi > 200).length;
  const r = getRole(role);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const quick = [
    { icon: FileText,        label: "Generate Complaint",  to: "/complaints" },
    { icon: Zap,             label: "Trigger Demo Surge",  to: "/dashboard" },
    { icon: MapIcon,         label: "Live AQI Map",        to: "/map" },
    { icon: Download,        label: "Latest Report",       to: "/reports" },
    { icon: Siren,           label: "Emergency Broadcast", to: "/emergency" },
    { icon: ClipboardCheck,  label: "Create Inspection",   to: "/inspector" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4 md:pt-24"
          style={{ background: "oklch(0.08 0.02 230 / 0.65)", backdropFilter: "blur(14px) saturate(140%)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-3xl w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            style={{ boxShadow: "0 30px 100px -20px oklch(0.05 0.02 230 / 0.9), 0 0 0 1px oklch(0.82 0.20 165 / 0.18)" }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-3 p-4 border-b border-border/40">
              <Command className="w-4 h-4 text-primary" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Command Center</div>
              <div className="flex-1" />
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted/50 transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border-b border-border/40">
              {/* User + role */}
              <div className="md:col-span-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl grid place-items-center font-semibold text-sm"
                  style={{ background: `linear-gradient(135deg, ${r.tone}, oklch(0.82 0.20 165))`, color: "oklch(0.12 0.02 230)" }}>
                  {r.short}
                </div>
                <div className="leading-tight">
                  <div className="text-xs text-muted-foreground">Signed in as</div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{r.description}</div>
                </div>
              </div>
              {/* Live AQI */}
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-3">
                <Activity className="w-4 h-4" style={{ color: cat.color }} />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Network AQI</div>
                  <div className="font-bold tabular-nums" style={{ color: cat.color }}>{networkAqi} · {cat.label}</div>
                </div>
              </div>
              {/* Emergency */}
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-3">
                <Siren className={`w-4 h-4 ${surge > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Emergency</div>
                  <div className="font-bold">{surge > 0 ? `${surge} surge nodes` : "All clear"}</div>
                </div>
              </div>
            </div>

            {/* Search + quick actions */}
            <div className="p-4 border-b border-border/40 space-y-3">
              <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules, actions, villages…"
                  className="bg-transparent flex-1 outline-none text-sm"
                />
                <kbd className="text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">ESC</kbd>
              </div>
              <div className="flex flex-wrap gap-2">
                {quick.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => { onClose(); navigate({ to: q.to }); }}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs hover:border-primary/60 transition"
                  >
                    <q.icon className="w-3.5 h-3.5 text-primary" />
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs grid */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {grouped.map(([group, items]) => (
                <div key={group}>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">{group}</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {items.map((t, i) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <Link
                          to={t.to}
                          onClick={onClose}
                          className="group block p-3 rounded-xl glass hover:scale-[1.02] hover:border-primary/60 transition-all relative overflow-hidden"
                        >
                          <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition"
                            style={{ background: "radial-gradient(circle, oklch(0.82 0.20 165 / 0.35), transparent 70%)" }} />
                          <div className="flex items-start justify-between">
                            <t.icon className="w-4 h-4 text-primary" />
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                          </div>
                          <div className="mt-2 font-semibold text-sm">{t.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{t.description}</div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center text-muted-foreground py-12 text-sm">No modules match "{query}".</div>
              )}
            </div>

            {/* Footer: role switcher */}
            <div className="p-4 border-t border-border/40">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Switch Role (Demo)</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Bell className="w-3 h-3" /> {tabs.length} modules available
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((rr) => (
                  <button
                    key={rr.id}
                    onClick={() => setRole(rr.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition border ${
                      role === rr.id ? "border-primary text-primary-foreground" : "border-border/50 text-muted-foreground hover:text-foreground"
                    }`}
                    style={role === rr.id ? { background: rr.tone, color: "oklch(0.12 0.02 230)" } : {}}
                  >
                    {rr.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useCommandCenter() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}