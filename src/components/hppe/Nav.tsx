import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Command, ChevronDown, Bell } from "lucide-react";
import { CommandCenter, useCommandCenter } from "./CommandCenter";
import { useRole } from "./useRole";
import { useAuth } from "./useAuth";
import { useLiveReadings } from "./useLiveReadings";
import { getRole } from "@/lib/hppe/roles";

export function Nav() {
  const { open, setOpen } = useCommandCenter();
  const { role } = useRole();
  const { session } = useAuth();
  const r = getRole(role);
  const navigate = useNavigate();
  const { readings } = useLiveReadings(5000);
  const notifs = readings.filter((x) => x.aqi > 200).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 gap-2">
          <button onClick={() => setOpen(true)} className="group flex items-center gap-2.5 outline-none min-w-0" aria-label="Open Command Center">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow group-hover:scale-105 transition shrink-0">
              <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              {notifs > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                  {notifs}
                </span>
              )}
            </div>
            <div className="leading-tight text-left hidden sm:block">
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
              className="relative md:hidden p-2 rounded-lg glass"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifs > 0 && (
                <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                  {notifs}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg glass text-xs"
              title={r.description}
            >
              <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: r.tone }} />
              <span className="hidden sm:inline font-medium truncate max-w-[120px]">{session?.name ?? r.name}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: r.tone, color: "oklch(0.12 0.02 230)" }}>
                {r.short}
              </span>
            </button>
            {session ? (
              <Link to="/dashboard" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition glow">
                Console
              </Link>
            ) : (
              <button
                onClick={() => navigate({ to: "/login" })}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition glow"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>
      <CommandCenter open={open} onClose={() => setOpen(false)} />
    </>
  );
}
