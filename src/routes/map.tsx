import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Map, Layers, Filter, Compass, AlertCircle, Building2, Radio } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { ClientOnly } from "@/components/hppe/ClientOnly";
import { LiveMap } from "@/components/hppe/LiveMap";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Statewide Industrial Corridor GIS Live Map · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "High-resolution GIS mapping of continuous ambient air quality, active stack plumes, and meteorological wind vectors across Gujarat industrial zones.",
      },
      { property: "og:title", content: "Statewide Industrial Corridor GIS Live Map · HPPE" },
      { property: "og:description", content: "Live geospatial pollution plumes, continuous CAAQMS stations, and GIDC industrial estates." },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/map" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { readings } = useLiveReadings(2500);
  const [selectedCluster, setSelectedCluster] = useState<string>("all");
  const [showIndustrial, setShowIndustrial] = useState<boolean>(true);

  // Filter readings based on selected cluster
  const filteredReadings = selectedCluster === "all"
    ? readings
    : readings.filter((r) => r.name.toLowerCase().includes(selectedCluster.toLowerCase()));

  return (
    <PageShell
      path="/map"
      title="Statewide Industrial Corridor GIS Live Map"
      eyebrow="Geospatial Intelligence"
      icon={Map}
      description="Hyperlocal pollution plumes, real-time wind dispersal vectors, and industrial cluster monitoring across Vapi, Ankleshwar, Dahej, Sachin, and Vatva."
    >
      <div className="space-y-4">

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass rounded-2xl border border-border/50">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 font-mono uppercase text-[10px]">
              <Filter className="w-3.5 h-3.5 text-primary" /> Corridor:
            </span>
            {[
              { id: "all", label: "All Gujarat Belts" },
              { id: "vapi", label: "Vapi GIDC" },
              { id: "ankleshwar", label: "Ankleshwar Estate" },
              { id: "dahej", label: "Dahej PCPIR" },
              { id: "sachin", label: "Sachin GIDC" },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCluster(c.id)}
                className={`px-3 py-1.5 rounded-lg transition text-xs font-medium ${
                  selectedCluster === c.id
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "glass hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowIndustrial(!showIndustrial)}
              className={`px-3 py-1.5 rounded-lg glass border transition flex items-center gap-1.5 ${
                showIndustrial ? "border-primary/50 text-primary" : "border-border/40 text-muted-foreground"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {showIndustrial ? "Industrial Stacks Visible" : "Industrial Stacks Hidden"}
            </button>
          </div>
        </div>

        {/* GIS Map */}
        <ClientOnly
          fallback={
            <div className="glass rounded-2xl h-[640px] flex items-center justify-center text-muted-foreground text-sm">
              Loading geospatial intelligence system…
            </div>
          }
        >
          <LiveMap
            readings={filteredReadings}
            height={640}
            showIndustrialClusters={showIndustrial}
          />
        </ClientOnly>

        {/* Bottom statistics panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-4 border border-border/40">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Radio className="w-4 h-4 text-emerald-400" /> Continuous Telemetry
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Telemetry refreshed every 2.5 seconds via GSPCB IoT server web-sockets with microclimate drift compensation.
            </p>
          </div>
          <div className="glass rounded-2xl p-4 border border-border/40">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Compass className="w-4 h-4 text-sky-400" /> Plume Dispersion Modeling
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Vectors compute atmospheric boundary layer height, wind velocity, and Gaussian puff dispersion towards vulnerable human settlements.
            </p>
          </div>
          <div className="glass rounded-2xl p-4 border border-border/40">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Early Warning Buffer
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Buffer zones automatically flag gram panchayat jurisdictions when particulate density exceeds National Ambient Air Quality Standards (NAAQS).
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}