import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · HPEE" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell path="/settings" title="Settings" eyebrow="Workspace" icon={SettingsIcon}
      description="Manage thresholds, languages and notification preferences.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        {[
          { k: "AQI alert threshold", v: "150" },
          { k: "Language",            v: "English · ગુજરાતી" },
          { k: "Voice alerts",        v: "Enabled" },
          { k: "WhatsApp dispatch",   v: "Connected" },
          { k: "Time zone",           v: "IST · GMT+5:30" },
          { k: "Theme",               v: "Command Dark" },
        ].map((row) => (
          <div key={row.k} className="glass rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{row.k}</div>
            <div className="text-sm font-medium">{row.v}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}