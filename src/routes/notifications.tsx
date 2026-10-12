import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Bell, ShieldCheck, FileText } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Environmental Advisory & Inspection Notifications · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Operational notifications feed for field inspectors, regional officers, and gram panchayats across Gujarat industrial zones.",
      },
      { property: "og:title", content: "Environmental Notifications · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/notifications" },
    ],
  }),
  component: Page,
});

const FEED = [
  { icon: Bell,        title: "Surge detected at Vatva-Lake",          time: "2 min ago", tone: "oklch(0.78 0.20 60)" },
  { icon: FileText,    title: "Form-A GSPCB-2026-A-1052 filed",         time: "12 min ago", tone: "oklch(0.82 0.20 165)" },
  { icon: ShieldCheck, title: "Inspector accepted case at Sarigam",     time: "1 hr ago",   tone: "oklch(0.72 0.18 220)" },
  { icon: Bell,        title: "Wind shift advisory — Bharuch district", time: "3 hr ago",   tone: "oklch(0.78 0.20 80)" },
];

function Page() {
  return (
    <PageShell path="/notifications" title="Notifications" eyebrow="Inbox" icon={Inbox}
      description="Unified inbox of system, field and regulatory events.">
      <div className="space-y-3 max-w-3xl">
        {FEED.map((f, i) => (
          <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg grid place-items-center" style={{ background: `${f.tone.replace(")", " / 0.18)")}` }}>
              <f.icon className="w-4 h-4" style={{ color: f.tone }} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.time}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}