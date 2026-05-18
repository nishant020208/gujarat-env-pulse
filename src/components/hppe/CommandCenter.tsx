import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search, X, Command, FileText, Siren, Map as MapIcon, Download,
  ClipboardCheck, Zap, ChevronRight, Bell, Activity, LogOut, CornerDownLeft,
} from "lucide-react";
import { tabsForRole, getRole, type TabDef } from "@/lib/hppe/roles";
import { useRole } from "./useRole";
import { useAuth } from "./useAuth";
import { useLiveReadings } from "./useLiveReadings";
import { aqiCategory } from "@/lib/hppe/data";

interface Props { open: boolean; onClose: () => void; }

// Lightweight fuzzy match: returns score (lower = better) or null if no match.
function fuzzyScore(text: string, q: string): number | null {
  if (!q) return 0;
  const t = text.toLowerCase();
  const query = q.toLowerCase();
  if (t.includes(query)) return t.indexOf(query); // prefer earlier matches
  let ti = 0, qi = 0, score = 0, lastIdx = -1;
  while (ti < t.length && qi < query.length) {
    if (t[ti] === query[qi]) {
      if (lastIdx >= 0) score += ti - lastIdx;
      lastIdx = ti;
      qi++;
    }
    ti++;
  }
  return qi === query.length ? score + 100 : null;
}

export function CommandCenter({ open, onClose }: Props) {
  const { role } = useRole();
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const { readings } = useLiveReadings(3500);
  const listRef = useRef<HTMLDivElement>(null);

  const tabs = useMemo(() => tabsForRole(role), [role]);

  const scored = useMemo(() => {
    if (!query.trim()) return tabs.map((t) => ({ t, s: 0 }));
    return tabs
      .map((t) => {
        const a = fuzzyScore(t.label, query);
        const b = fuzzyScore(t.description, query);
        const c = fuzzyScore(t.group, query);
        const s = [a, b, c].filter((x): x is number => x !== null).sort((x, y) => x - y)[0];
        return s === undefined ? null : { t, s };
      })
      .filter((x): x is { t: TabDef; s: number } => x !== null)
      .sort((a, b) => a.s - b.s);
  }, [tabs, query]);

  const flat = scored.map((x) => x.t);
  const grouped = useMemo(() => {
    const m = new Map<string, TabDef[]>();
    scored.forEach(({ t }) => {
      const arr = m.get(t.group) ?? [];
      arr.push(t);
      m.set(t.group, arr);
    });
    return Array.from(m.entries());
  }, [scored]);

  useEffect(() => { setCursor(0); }, [query, open]);

  // Network telemetry
  const networkAqi = readings.length
    ? Math.round(readings.reduce((s, r) => s + r.aqi, 0) / readings.length)
    : 0;
  const cat = aqiCategory(networkAqi);
  const surge = readings.filter((r) => r.aqi > 200).length;
  const hazard = readings.filter((r) => r.aqi > 300).length;
  const notifCount = surge + (hazard > 0 ? hazard : 0);
  const r = getRole(role);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, Math.max(0, flat.length - 1))); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
      if (e.key === "Enter") {
        e.preventDefault();
        const target = flat[cursor];
        if (target) { onClose(); navigate({ to: target.to }); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, flat, cursor, navigate]);

  // Quick actions filtered by access
  const quick = [
    { icon: FileText,       label: "Generate Complaint",  to: "/complaints" },
    { icon: Zap,            label: "Trigger Demo Surge",  to: "/dashboard" },
    { icon: MapIcon,        label: "Live AQI Map",        to: "/map" },
    { icon: Download,       label: "Latest Report",       to: "/reports" },
    { icon: Siren,          label: "Emergency Broadcast", to: "/emergency" },
    { icon: ClipboardCheck, label: "Create Inspection",   to: "/inspector" },
  ].filter((q) => tabs.some((t) => t.to === q.to));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-stretch md:items-start justify-center md:pt-16 px-0 md:px-4"
          style={{ background: "oklch(0.08 0.02 230 / 0.7)", backdropFilter: "blur(14px) saturate(140%)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -10, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -5, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong md:rounded-3xl w-full max-w-6xl md:max-h-[85vh] h-full md:h-auto overflow-hidden flex flex-col shadow-2xl"
            style={{ boxShadow: "0 30px 100px -20px oklch(0.05 0.02 230 / 0.9), 0 0 0 1px oklch(0.82 0.20 165 / 0.18)" }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-3 p-4 border-b border-border/40">
              <Command className="w-4 h-4 text-primary" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Command Center</div>
              <div className="flex-1" />
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted/50 transition" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header — user, AQI, emergency, notifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border-b border-border/40">
              <div className="lg:col-span-2 flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl grid place-items-center font-semibold text-sm shrink-0"
                  style={{ background: `linear-gradient(135deg, ${r.tone}, oklch(0.82 0.20 165))`, color: "oklch(0.12 0.02 230)" }}>
                  {r.short}
                </div>
                <div className="leading-tight min-w-0">
                  <div className="text-xs text-muted-foreground truncate">{session?.organisation ?? "—"}</div>
                  <div className="font-semibold truncate">{session?.name ?? "Guest"} · {r.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono truncate">{session?.email ?? "not signed in"}</div>
                </div>
              </div>
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-3">
                <Activity className="w-4 h-4" style={{ color: cat.color }} />
                <div className="leading-tight min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Network AQI</div>
                  <div className="font-bold tabular-nums truncate" style={{ color: cat.color }}>{networkAqi} · {cat.label}</div>
                </div>
              </div>
              <div className="glass rounded-xl px-3 py-2 flex items-center gap-3 relative">
                <Siren className={`w-4 h-4 ${hazard > 0 ? "text-destructive animate-pulse" : surge > 0 ? "text-amber-400" : "text-muted-foreground"}`} />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Emergency</div>
                  <div className="font-bold">
                    {hazard > 0 ? `${hazard} HAZARD` : surge > 0 ? `${surge} surge nodes` : "All clear"}
                  </div>
                </div>
                {notifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                    {notifCount}
                  </span>
                )}
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
                  placeholder="Search modules — fuzzy supported. ↑↓ to navigate, ⏎ to open."
                  className="bg-transparent flex-1 outline-none text-sm min-w-0"
                />
                <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
                  <CornerDownLeft className="w-3 h-3" /> open
                </kbd>
                <kbd className="text-[10px] font-mono text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">ESC</kbd>
              </div>
              {quick.length > 0 && (
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
              )}
            </div>

            {/* Tabs grid */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-5">
              {grouped.map(([group, items]) => (
                <div key={group}>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">{group}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {items.map((t, i) => {
                      const active = flat[cursor]?.id === t.id;
                      return (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.015 }}
                        >
                          <Link
                            to={t.to}
                            onClick={onClose}
                            className={`group block p-3 rounded-xl glass hover:scale-[1.02] hover:border-primary/60 transition-all relative overflow-hidden ${active ? "border-primary scale-[1.02]" : ""}`}
                            style={active ? { boxShadow: "0 0 0 2px oklch(0.82 0.20 165 / 0.6)" } : {}}
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
                      );
                    })}
                  </div>
                </div>
              ))}
              {flat.length === 0 && (
                <div className="text-center text-muted-foreground py-12 text-sm">No modules match "{query}".</div>
              )}
            </div>

            {/* Footer — session info + logout */}
            <div className="p-4 border-t border-border/40 flex items-center justify-between gap-3">
              <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                <Bell className="w-3 h-3" /> {tabs.length} modules · role-scoped access
              </div>
              <button
                onClick={() => { logout(); onClose(); navigate({ to: "/login" }); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border/60 hover:border-destructive/60 hover:text-destructive transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign out
              </button>
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
