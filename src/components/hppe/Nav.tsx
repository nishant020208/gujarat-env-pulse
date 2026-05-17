import { Link } from "@tanstack/react-router";
import { Activity, Command, ChevronDown } from "lucide-react";
import { CommandCenter, useCommandCenter } from "./CommandCenter";
import { useRole } from "./useRole";
import { getRole } from "@/lib/hppe/roles";

export function Nav() {
  const { open, setOpen } = useCommandCenter();
  const { role } = useRole();
  const r = getRole(role);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-6 py-3">
          <button
            onClick={() => setOpen(true)}
            className="group flex items-center gap-2.5 outline-none"
            aria-label="Open Command Center"
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow group-hover:scale-105 transition">
              <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight text-left">
              <div className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
                HPEE <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:translate-y-0.5 transition" />
              </div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Evidence Engine</div>
            </div>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-foreground transition"
          >
            <Command className="w-3.5 h-3.5" />
            Search modules…
            <kbd className="ml-3 font-mono text-[10px] border border-border/60 rounded px-1.5 py-0.5">⌘K</kbd>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg glass text-xs"
              title={r.description}
            >
              <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: r.tone, color: r.tone }} />
              <span className="hidden sm:inline font-medium">{r.name}</span>
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-mono"
                style={{ background: r.tone, color: "oklch(0.12 0.02 230)" }}
              >
                {r.short}
              </span>
            </button>
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition glow"
            >
              Console
            </Link>
          </div>
        </div>
      </header>
      <CommandCenter open={open} onClose={() => setOpen(false)} />
    </>
  );
}