import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldOff, ArrowLeft, Mail } from "lucide-react";
import { denialMessage, type AccessDenialReason } from "@/lib/hppe/access";

export const Route = createFileRoute("/unauthorized")({
  head: () => ({
    meta: [
      { title: "Authorization Required · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Access restricted to authorized Gujarat Pollution Control Board officers and designated stakeholders.",
      },
      { property: "og:title", content: "Access Restricted · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/unauthorized" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ reason: (s.reason as AccessDenialReason | undefined) }),
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  const { reason } = useSearch({ from: "/unauthorized" });
  const msg = reason ? denialMessage(reason) : "You are not authorised to view this resource.";
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-10 max-w-lg w-full text-center"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 border border-destructive/30 grid place-items-center mb-5">
          <ShieldOff className="w-7 h-7 text-destructive" />
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-destructive">// Error 403</div>
        <h1 className="text-2xl font-bold mt-2">Access Restricted</h1>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{msg}</p>
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <Link to="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </Link>
          <a href="mailto:gspcb@hppe.gov.in" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm">
            <Mail className="w-4 h-4" /> Request access
          </a>
        </div>
      </motion.div>
    </div>
  );
}