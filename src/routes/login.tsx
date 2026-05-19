import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/hppe/useAuth";
import { getRole } from "@/lib/hppe/roles";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · HPEE" },
      { name: "description", content: "Authorised access to the Hyperlocal Pollution Evidence Engine." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard" });
  }, [session, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.ok) {
        setError(result.message ?? "Access denied.");
        if (result.reason && result.reason !== "bad_credentials") {
          navigate({ to: "/unauthorized", search: { reason: result.reason } as never });
        }
        return;
      }
      navigate({ to: "/dashboard" });
    }, 350);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 grid-bg">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-[120px] animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-accent/15 blur-[140px]" />
        </div>
        <Link to="/" className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow">
            <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">HPEE</div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Evidence Engine</div>
          </div>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-md">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-3">// Restricted access</div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Gujarat's hyperlocal <span className="text-gradient">environmental intelligence cockpit</span>.
          </h1>
          <p className="text-muted-foreground mt-4 text-sm">
            Sign in with the credentials issued by your district controller, GSPCB regional office, or village panchayat.
          </p>
          <div className="mt-6 glass rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              Every action is journalled to an immutable audit log. Sessions expire after 8 hours of inactivity. Demo credentials are provided in the secure handover note from your project lead — never share them publicly.
            </div>
          </div>
        </motion.div>
        <div className="relative text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          © 2026 HPEE · Aligned with GSPCB & CPCB norms
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-strong rounded-3xl p-8 sm:p-10 space-y-5"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center glow">
              <Activity className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="font-semibold">HPEE</div>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sign in to your console</h2>
            <p className="text-sm text-muted-foreground mt-1">Authorised personnel only.</p>
          </div>

          <label className="block">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">Official email</div>
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 focus-within:border-primary/60 transition">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hppe.gov.in"
                className="bg-transparent flex-1 outline-none text-sm"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="block">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">Password</div>
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 focus-within:border-primary/60 transition">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent flex-1 outline-none text-sm"
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error && (
            <div className="flex items-start gap-2 text-xs text-destructive glass rounded-lg p-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold glow disabled:opacity-60"
          >
            {loading ? "Verifying…" : <>Enter Command Center <ArrowRight className="w-4 h-4" /></>}
          </button>

          <div className="text-[11px] text-muted-foreground text-center pt-1">
            Need access? Contact your GSPCB regional administrator or use{" "}
            <Link to="/" className="text-primary underline-offset-2 hover:underline">return to landing</Link>.
          </div>
        </motion.form>
      </div>
    </div>
  );
}

// suppress unused warning for getRole import in some bundlers
void getRole;
