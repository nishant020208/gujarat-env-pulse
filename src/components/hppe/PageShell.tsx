import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Nav } from "./Nav";
import { useRole } from "./useRole";
import { useAuth } from "./useAuth";
import { canAccess, getRole, type RoleId } from "@/lib/hppe/roles";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: LucideIcon;
  requireRoles?: RoleId[];
  path: string;
  actions?: ReactNode;
  children: ReactNode;
  hideBreadcrumbs?: boolean;
}

export function PageShell({
  title,
  eyebrow,
  description,
  icon: Icon,
  requireRoles,
  path,
  actions,
  children,
  hideBreadcrumbs = false,
}: Props) {
  const { role } = useRole();
  const { isAuthed } = useAuth();
  const r = getRole(role);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthed) navigate({ to: "/login" });
  }, [isAuthed, navigate]);

  const allowed = isAuthed && (requireRoles ? requireRoles.includes(role) : canAccess(role, path));

  useEffect(() => {
    if (isAuthed && !allowed) navigate({ to: "/unauthorized", search: { reason: "not_listed" } as never });
  }, [isAuthed, allowed, navigate]);

  return (
    <div className="min-h-screen pt-20">
      <Nav />
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 pb-12">
        {/* Automatic Breadcrumb Navigation */}
        {!hideBreadcrumbs && path !== "/" && (
          <div className="pt-2 pb-1">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Public Portal</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {path !== "/dashboard" ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/dashboard">Command Center</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Command Center</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end justify-between gap-4 mt-2 mb-6"
        >
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="w-12 h-12 rounded-xl glass-strong grid place-items-center glow shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              {eyebrow && (
                <div className="text-[11px] font-mono uppercase tracking-widest text-primary">// {eyebrow}</div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-foreground">{title}</h1>
              {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">{description}</p>}
            </div>
          </div>
          {actions}
        </motion.div>

        {!isAuthed ? (
          <div className="glass-strong rounded-2xl p-10 text-center max-w-xl mx-auto border border-border/50 shadow-xl">
            <ShieldAlert className="w-10 h-10 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-semibold">Authentication Required</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Validating session security tokens… Redirecting to authorized sign-in.
            </p>
          </div>
        ) : !allowed ? (
          <div className="glass-strong rounded-2xl p-10 text-center max-w-xl mx-auto border border-destructive/30 shadow-xl">
            <ShieldAlert className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h2 className="text-xl font-semibold">Restricted Environmental Module</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Your personnel role <span className="font-mono text-foreground font-semibold">{r.name}</span> does not have authorization clearance for this command surface.
            </p>
            <Link to="/dashboard" className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold glow">
              Return to Command Center
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
