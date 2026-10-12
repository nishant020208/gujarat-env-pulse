import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatches,
  useLocation,
} from "@tanstack/react-router";
import { Activity, Compass, Home, Map, Camera, FileText, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { getRouter } from "../router";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Runtime route error caught:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full text-center glass-strong p-8 rounded-3xl border border-border/50 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-destructive/20 text-destructive grid place-items-center mx-auto mb-4">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          System Telemetry Interrupt
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          The application encountered an unexpected state while loading this environmental surface. Telemetry fail-safes are active.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow cursor-pointer"
          >
            Retry Telemetry
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-input glass px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}

function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background px-4 py-8">
      {/* Top Navbar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center glow">
            <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-sm font-bold">Gujarat Environment Pulse</div>
            <div className="text-[10px] text-muted-foreground font-mono">HPPE · GPCB State Portal</div>
          </div>
        </Link>
        <Link to="/dashboard" className="text-xs text-primary hover:underline font-mono">
          Go to Command Center &rarr;
        </Link>
      </div>

      {/* Main 404 Body */}
      <div className="max-w-xl w-full mx-auto text-center my-12 glass-strong rounded-3xl p-8 sm:p-12 border border-border/50 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-mono uppercase tracking-wider mb-4">
          <Compass className="w-3.5 h-3.5" /> Error 404 · Unmapped Spatial Endpoint
        </div>
        <div className="text-7xl font-extrabold tracking-tighter text-foreground mb-3">404</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Telemetry Surface Not Located
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The requested coordinate or government surveillance module does not exist on the Gujarat Environmental Pulse (HPPE) network.
        </p>

        {/* Quick Nav Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-left">
          <Link
            to="/dashboard"
            className="p-3.5 rounded-2xl glass hover:border-primary/50 transition border border-border/40 group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-foreground group-hover:text-primary">
              <Home className="w-4 h-4 text-primary" /> Command Center
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Live overview & alerts</div>
          </Link>
          <Link
            to="/map"
            className="p-3.5 rounded-2xl glass hover:border-primary/50 transition border border-border/40 group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-foreground group-hover:text-primary">
              <Map className="w-4 h-4 text-primary" /> GIS Live Map
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Spatial air quality plumes</div>
          </Link>
          <Link
            to="/field"
            className="p-3.5 rounded-2xl glass hover:border-primary/50 transition border border-border/40 group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-foreground group-hover:text-primary">
              <Camera className="w-4 h-4 text-primary" /> Field Uploads
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Geotagged site inspection</div>
          </Link>
          <Link
            to="/complaints"
            className="p-3.5 rounded-2xl glass hover:border-primary/50 transition border border-border/40 group"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-foreground group-hover:text-primary">
              <FileText className="w-4 h-4 text-primary" /> GPCB Complaints
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Statutory grievance filing</div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90 glow"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Portal
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center rounded-xl border border-input glass px-4 py-2.5 text-xs font-medium text-foreground transition hover:bg-accent"
          >
            Sign In with Official Credentials
          </Link>
        </div>

        {/* Support Help */}
        <div className="mt-8 pt-6 border-t border-border/30 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Phone className="w-3.5 h-3.5 text-primary" />
          <span>GPCB State Helpline: </span>
          <span className="font-mono text-foreground font-semibold">1800-233-1234</span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-[10px] font-mono uppercase text-muted-foreground tracking-widest">
        Government of Gujarat · Gujarat Pollution Control Board · HPPE Portal
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: RootNotFound,
  errorComponent: ErrorComponent,
});

const CUSTOM_DOMAIN = "https://hppe.gujarat.gov.in";

function DocumentHead() {
  const matches = useMatches();
  const location = useLocation();

  useEffect(() => {
    const router = getRouter() as unknown as {
      routesById: Record<string, { options?: { head?: () => { meta?: Array<Record<string, unknown>> } } }>;
    };

    let title = "Gujarat Environment Pulse · Hyperlocal Pollution Evidence Engine (HPPE) | GPCB";
    let description = "Real-time continuous ambient air quality monitoring, industrial emission tracking, and automated GPCB statutory complaints for Gujarat.";

    for (let i = matches.length - 1; i >= 0; i--) {
      const id = (matches[i] as { routeId: string }).routeId;
      const meta = router.routesById?.[id]?.options?.head?.()?.meta;
      const foundTitle = meta?.find((m) => typeof (m as { title?: unknown }).title === "string") as { title: string } | undefined;
      const foundDesc = meta?.find((m) => (m as { name?: string }).name === "description" || (m as { property?: string }).property === "og:description") as { content?: string } | undefined;

      if (foundTitle?.title) title = foundTitle.title;
      if (foundDesc?.content) description = foundDesc.content;
      if (foundTitle?.title) break;
    }

    // Set page title
    document.title = title;

    // Set canonical link
    const canonicalUrl = `${CUSTOM_DOMAIN}${location.pathname === "/" ? "" : location.pathname}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Helper to update or create meta tags
    const setMeta = (nameOrProp: "name" | "property", key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${nameOrProp}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(nameOrProp, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:image", `${CUSTOM_DOMAIN}/og-image.png`);
    setMeta("property", "og:site_name", "Gujarat Environment Pulse (HPPE)");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", `${CUSTOM_DOMAIN}/og-image.png`);
  }, [matches, location]);

  return null;
}

function RootComponent() {
  return (
    <>
      <DocumentHead />
      <Outlet />
    </>
  );
}
