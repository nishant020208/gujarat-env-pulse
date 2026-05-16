import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow">
            <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">HPEE</div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Evidence Engine</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="/#modules" className="hover:text-foreground transition">Modules</a>
          <a href="/#how" className="hover:text-foreground transition">How it works</a>
          <a href="/#live" className="hover:text-foreground transition">Live Demo</a>
          <Link to="/dashboard" className="hover:text-foreground transition">Command Center</Link>
        </nav>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition glow"
        >
          Launch Console
        </Link>
      </div>
    </header>
  );
}