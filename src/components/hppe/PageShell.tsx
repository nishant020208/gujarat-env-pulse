import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Nav } from "./Nav";
import { useRole } from "./useRole";
import { useAuth } from "./useAuth";
import { canAccess, getRole, type RoleId } from "@/lib/hppe/roles";

interface Props {
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: LucideIcon;
  requireRoles?: RoleId[];
  path: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, eyebrow, description, icon: Icon, requireRoles, path, actions, children }: Props) {
  const { role } = useRole();
  const { isAuthed } = useAuth();
  const r = getRole(role);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthed) navigate({ to: "/login" });
  }, [isAuthed, navigate]);

  const allowed = isAuthed && (requireRoles ? requireRoles.includes(role) : canAccess(role, path));

  return (
    <div className="min-h-screen pt-20">
      <Nav />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end justify-between gap-4 mt-4 mb-6"
        >
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="w-12 h-12 rounded-xl glass-strong grid place-items-center glow">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              {eyebrow && (
                <div className="text-[11px] font-mono uppercase tracking-widest text-primary">// {eyebrow}</div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{title}</h1>
              {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
            </div>
          </div>
          {actions}
        </motion.div>

        {!isAuthed ? (
          <div className="glass-strong rounded-2xl p-10 text-center max-w-xl mx-auto">
            <ShieldAlert className="w-10 h-10 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-semibold">Authentication required</h2>
            <p className="text-sm text-muted-foreground mt-2">Redirecting to sign-in…</p>
          </div>
        ) : !allowed ? (
          <div className="glass-strong rounded-2xl p-10 text-center max-w-xl mx-auto">
            <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h2 className="text-xl font-semibold">Restricted Module</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your role <span className="font-mono text-foreground">{r.name}</span> does not have access to this workspace.
            </p>
            <Link to="/dashboard" className="inline-block mt-5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              Back to Command Center
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
