import { createFileRoute } from "@tanstack/react-router";
import { Factory } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { INDUSTRIES } from "@/lib/hppe/data";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "GIDC Industrial Clusters & Emission Registry · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Surveillance directory of active GIDC industrial clusters across Vapi, Ankleshwar, Dahej, Sachin, and Vatva including shift rosters and continuous stack emission profiles.",
      },
      { property: "og:title", content: "GIDC Industrial Clusters Registry · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/industries" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PageShell path="/industries" title="Industrial Clusters" eyebrow="Source Registry" icon={Factory}
      description="Active GIDC clusters across the corridor with shift status and emission profile.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INDUSTRIES.map((i) => (
          <div key={i.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{i.type}</div>
                <h3 className="text-lg font-semibold">{i.name}</h3>
                <div className="text-xs text-muted-foreground mt-1">Lat {i.lat.toFixed(3)} · Lng {i.lng.toFixed(3)}</div>
              </div>
              <span
                className="px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest"
                style={{ background: i.activeShift ? "oklch(0.78 0.20 60 / 0.2)" : "oklch(0.4 0.02 230 / 0.4)",
                         color: i.activeShift ? "oklch(0.78 0.20 60)" : "oklch(0.7 0.03 200)" }}>
                {i.activeShift ? "Active Shift" : "Idle"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Mini label="Boiler" value={i.activeShift ? "Running" : "Off"} />
              <Mini label="Furnace" value={i.activeShift ? "06:00–22:00" : "—"} />
              <Mini label="Risk" value={i.activeShift ? "High" : "Low"} />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/40 border border-border/40 py-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold mt-0.5">{value}</div>
    </div>
  );
}