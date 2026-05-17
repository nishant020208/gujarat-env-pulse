import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { ROLES } from "@/lib/hppe/roles";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Help Center · HPEE" }] }),
  component: Page,
});

function Page() {
  return (
    <PageShell path="/help" title="Help Center" eyebrow="Documentation" icon={HelpCircle}
      description="Demo accounts, keyboard shortcuts and integration guide.">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-3">Demo Accounts</h3>
          <div className="space-y-2">
            {ROLES.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-background/40 border border-border/40">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.description}</div>
                </div>
                <code className="text-xs font-mono text-primary">{r.id}@hppe.demo</code>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-3">Shortcuts</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between"><span>Open Command Center</span><kbd className="font-mono text-xs border border-border/60 rounded px-1.5 py-0.5">⌘ K</kbd></li>
            <li className="flex justify-between"><span>Close panel</span><kbd className="font-mono text-xs border border-border/60 rounded px-1.5 py-0.5">ESC</kbd></li>
            <li className="flex justify-between"><span>Search modules</span><kbd className="font-mono text-xs border border-border/60 rounded px-1.5 py-0.5">/</kbd></li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}