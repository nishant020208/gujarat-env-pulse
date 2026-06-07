import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, User, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/components/hppe/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · HPEE" },
      { name: "description", content: "Authorised access to the Hyperlocal Pollution Evidence Engine." },
    ],
  }),
  component: LoginPage,
});

type Tab = "login" | "signup";

function LoginPage() {
  const { session, login, signUp } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");

  // login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // signup state
  const [su, setSu] = useState({ name: "", email: "", password: "", confirm: "" });
  const [suState, setSuState] = useState<"idle" | "loading" | "done">("idle");
  const [suError, setSuError] = useState<string | null>(null);
  const [suMsg, setSuMsg] = useState<string | null>(null);

  useEffect(() => { if (session) navigate({ to: "/dashboard" }); }, [session, navigate]);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Access denied.");
      return;
    }
    navigate({ to: "/dashboard" });
  };

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuError(null);
    if (su.password.length < 8) return setSuError("Password must be at least 8 characters.");
    if (su.password !== su.confirm) return setSuError("Passwords do not match.");
    setSuState("loading");
    const r = await signUp(su.name, su.email, su.password);
    if (!r.ok) { setSuError(r.message); setSuState("idle"); return; }
    setSuMsg(r.message);
    setSuState("done");
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
            Sign in with your approved account, or request access. Newly signed-up accounts require
            <span className="text-foreground font-medium"> admin approval</span> before login.
          </p>
          <div className="mt-6 glass rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              Every action is journalled to an immutable audit log. Sessions expire after 8 hours of inactivity.
            </div>
          </div>
        </motion.div>
        <div className="relative text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          © 2026 HPEE · Aligned with GSPCB & CPCB norms
        </div>
      </div>

      {/* Right card with tabs */}
      <div className="flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-strong rounded-3xl p-6 sm:p-8 md:p-10"
        >
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center glow">
              <Activity className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="font-semibold">HPEE</div>
          </Link>

          {/* Tabs */}
          <div className="relative grid grid-cols-2 mb-6 rounded-xl glass p-1 text-sm">
            <button
              onClick={() => setTab("login")}
              className={`relative py-2 rounded-lg font-medium z-10 min-h-[44px] ${tab === "login" ? "text-primary-foreground" : "text-muted-foreground"}`}
            >Login</button>
            <button
              onClick={() => setTab("signup")}
              className={`relative py-2 rounded-lg font-medium z-10 min-h-[44px] ${tab === "signup" ? "text-primary-foreground" : "text-muted-foreground"}`}
            >Sign Up</button>
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-r from-primary to-accent glow"
              style={{ left: tab === "login" ? 4 : "calc(50% + 0px)" }}
            />
          </div>

          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.form
                key="login"
                onSubmit={submitLogin}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Sign in to your console</h2>
                  <p className="text-sm text-muted-foreground mt-1">Approved personnel only.</p>
                </div>
                <Field icon={Mail} label="Official email" type="email" value={email} onChange={setEmail} placeholder="name@hppe.gov.in" />
                <Field icon={Lock} label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                {error && <ErrorBox>{error}</ErrorBox>}
                <button
                  type="submit" disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold glow disabled:opacity-60"
                >
                  {loading ? "Verifying…" : <>Enter Command Center <ArrowRight className="w-4 h-4" /></>}
                </button>
                <div className="text-[11px] text-muted-foreground text-center pt-1">
                  No account?{" "}
                  <button type="button" onClick={() => setTab("signup")} className="text-primary hover:underline">Request access</button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                onSubmit={submitSignup}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Request platform access</h2>
                  <p className="text-sm text-muted-foreground mt-1">An admin reviews every new account.</p>
                </div>
                {suState === "done" ? (
                  <div className="rounded-xl glass p-5 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
                    <div className="font-medium">{suMsg}</div>
                    <button type="button" onClick={() => setTab("login")} className="text-xs text-primary hover:underline">Back to sign in</button>
                  </div>
                ) : (
                  <>
                    <Field icon={User} label="Full name" value={su.name} onChange={(v) => setSu({ ...su, name: v })} placeholder="Your full name" />
                    <Field icon={Mail} label="Email" type="email" value={su.email} onChange={(v) => setSu({ ...su, email: v })} placeholder="name@example.gov.in" />
                    <Field icon={Lock} label="Password" type="password" value={su.password} onChange={(v) => setSu({ ...su, password: v })} placeholder="At least 8 characters" />
                    <Field icon={Lock} label="Confirm password" type="password" value={su.confirm} onChange={(v) => setSu({ ...su, confirm: v })} placeholder="Repeat password" />
                    {suError && <ErrorBox>{suError}</ErrorBox>}
                    <button
                      type="submit" disabled={suState === "loading"}
                      className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold glow disabled:opacity-60"
                    >
                      {suState === "loading" ? "Submitting…" : <>Sign Up <ArrowRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      By signing up you agree to the platform's audit and data-handling policy.
                    </p>
                  </>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, type = "text", value, onChange, placeholder,
}: {
  icon: React.ComponentType<{ className?: string }>; label: string; type?: string;
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      <div className="flex items-center gap-2 glass rounded-xl px-3 py-2.5 min-h-[44px] focus-within:border-primary/60 transition">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent flex-1 outline-none text-sm"
          required
        />
      </div>
    </label>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs text-destructive glass rounded-lg p-2.5">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
