import { useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatches,
} from "@tanstack/react-router";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-[10px] font-mono uppercase tracking-widest text-primary">// Error 404</div>
        <h1 className="mt-3 text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Route not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This command surface is not available at the requested address.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: RootNotFound,
  errorComponent: ErrorComponent,
});

function DocumentHead() {
  const matches = useMatches();
  useEffect(() => {
    for (let i = matches.length - 1; i >= 0; i--) {
      const m = matches[i] as unknown as {
        routeId: string;
        context?: { head?: { meta?: Array<{ title?: string }> } };
      };
      // TanStack Router exposes head() output on match meta when present.
      // Fall back to scanning options on the router routes map.
      void m;
    }
    // Resolve title from any match that defined head() with a title meta.
    const router = (window as unknown as { __TSR_ROUTER__?: { routesById?: Record<string, { options?: { head?: () => { meta?: Array<Record<string, unknown>> } } }> } }).__TSR_ROUTER__;
    let title: string | undefined;
    for (let i = matches.length - 1; i >= 0; i--) {
      const id = (matches[i] as { routeId: string }).routeId;
      const route = router?.routesById?.[id];
      const meta = route?.options?.head?.()?.meta;
      const found = meta?.find((m) => "title" in m && typeof m.title === "string") as
        | { title: string }
        | undefined;
      if (found?.title) { title = found.title; break; }
    }
    if (title) document.title = title;
  }, [matches]);
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
