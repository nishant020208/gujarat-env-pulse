import { createFileRoute } from "@tanstack/react-router";
import { Map } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { ClientOnly } from "@/components/hppe/ClientOnly";
import { LiveMap } from "@/components/hppe/LiveMap";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";

export const Route = createFileRoute("/map")({
  head: () => ({ meta: [{ title: "Live AQI Map · HPEE" }] }),
  component: Page,
});

function Page() {
  const { readings } = useLiveReadings(2500);
  return (
    <PageShell path="/map" title="Live AQI Map" eyebrow="GIS Operations" icon={Map}
      description="Hyperlocal pollution plumes, wind vectors and industrial overlays for the Gujarat corridor.">
      <ClientOnly fallback={<div className="glass rounded-2xl h-[640px]" />}>
        <LiveMap readings={readings} height={640} />
      </ClientOnly>
    </PageShell>
  );
}