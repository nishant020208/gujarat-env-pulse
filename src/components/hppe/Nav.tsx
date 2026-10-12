import { Link, useNavigate } from "@tanstack/react-router";
import { Activity, Command, ChevronDown, Bell, Map, Camera, FileText, Radio, Building2 } from "lucide-react";
import { CommandCenter, useCommandCenter } from "./CommandCenter";
import { useRole } from "./useRole";
import { useAuth } from "./useAuth";
import { useLiveReadings } from "./useLiveReadings";
import { getRole } from "@/lib/hppe/roles";

export function Nav() {
  const { open, setOpen } = useCommandCenter();
  const { role } = useRole();
  const { session, logout } = useAuth();
  const r = getRole(role);
  const navigate = useNavigate();
  const { readings } = useLiveReadings(5000);
  const notifs = readings.filter((x) => x.aqi > 200).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/40 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2.5 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center gap-2.5 outline-none min-w-0" aria-label="Gujarat Environment Pulse Home">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow group-hover:scale-105 transition shrink-0">
                <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                {notifs > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                    {notifs}
                  </span>
                )}
              </div>
              <div className="leading-tight text-left">
                <div className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  Gujarat Environment Pulse
                </div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  HPPE · GPCB Portal
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 ml-4 border-l border-border/40 pl-4 text-xs font-medium">
              <Link
                to="/dashboard"
                className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
              >
                Dashboard
              </Link>
              <Link
                to="/map"
                className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
              >
                GIS Map
              </Link>
              <Link
                to="/field"
                className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
              >
                Field GIS
              </Link>
              <Link
                to="/complaints"
                className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
              >
                Complaints
              </Link>
              <Link
                to="/sensors"
                className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
              >
                Sensors
              </Link>
              <Link
                to="/industries"
                className="px-2.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                activeProps={{ className: "text-primary font-semibold bg-primary/10" }}
              >
                Industries
              </Link>
            </nav>
          </div>

          {/* Quick Search */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition cursor-pointer"
          >
            <Command className="w-3.5 h-3.5 text-primary" />
            <span>Search environmental surfaces…</span>
            <kbd className="ml-2 font-mono text-[10px] border border-border/60 rounded px-1.5 py-0.5">⌘K</kbd>
          </button>

          {/* Right Role and Account Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative p-2 rounded-xl glass hover:bg-muted/40 transition cursor-pointer"
              aria-label="Open Alerts & Command Center"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              {notifs > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold grid place-items-center">
                  {notifs}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl glass text-xs hover:border-primary/30 transition cursor-pointer"
              title={r.description}
            >
              <span className="w-2 h-2 rounded-full pulse-dot shrink-0" style={{ background: r.tone }} />
              <span className="hidden sm:inline font-medium truncate max-w-[130px]">{session?.name ?? r.name}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold" style={{ background: r.tone, color: "oklch(0.12 0.02 230)" }}>
                {r.short}
              </span>
            </button>

            {session ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition glow"
                >
                  Console
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate({ to: "/login" });
                  }}
                  className="px-2.5 py-1.5 rounded-xl glass text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition cursor-pointer"
                  title="Sign out"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate({ to: "/login" })}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition glow cursor-pointer"
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
