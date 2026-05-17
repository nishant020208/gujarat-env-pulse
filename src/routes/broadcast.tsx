import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { useState } from "react";

export const Route = createFileRoute("/broadcast")({
  head: () => ({ meta: [{ title: "Broadcast · HPEE" }] }),
  component: Page,
});

function Page() {
  const [msg, setMsg] = useState("Pollution surge detected — residents are advised to remain indoors until further notice.");
  return (
    <PageShell path="/broadcast" title="Broadcast Console" eyebrow="Communications" icon={Megaphone}
      description="Dispatch WhatsApp, SMS and voice advisories to villages.">
      <div className="glass-strong rounded-2xl p-6 max-w-2xl">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Advisory Message</label>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4}
          className="mt-2 w-full bg-background/40 border border-border/60 rounded-lg p-3 text-sm outline-none focus:border-primary" />
        <div className="flex flex-wrap gap-2 mt-3">
          {["English", "ગુજરાતી", "हिन्दी"].map((l) => (
            <span key={l} className="px-2 py-1 rounded glass text-xs">{l}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button className="p-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium">WhatsApp</button>
          <button className="p-3 rounded-lg glass text-sm font-medium">SMS</button>
          <button className="p-3 rounded-lg glass text-sm font-medium">Voice Call</button>
        </div>
      </div>
    </PageShell>
  );
}