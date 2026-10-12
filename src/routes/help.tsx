import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Shield, KeyRound, Terminal, Phone, BookOpen } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { ROLES } from "@/lib/hppe/roles";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Official Operating Manual & Help Center · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Operating documentation, keyboard shortcuts, CAAQMS integration protocols, and authorized role directory for the Gujarat Environment Pulse platform.",
      },
      { property: "og:title", content: "Operating Manual & Help Center · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/help" },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <PageShell
      path="/help"
      title="Platform Operations Manual & Directory"
      eyebrow="Official Documentation"
      icon={HelpCircle}
      description="Official operating procedures, keyboard navigation shortcuts, and authorized institutional role matrix for the Gujarat Environment Pulse (HPPE) network."
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 glass rounded-2xl p-6 border border-border/40">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/30">
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Authorized Institutional Roles
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Role-based access tiers registered with the Gujarat Pollution Control Board.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/20 text-primary">
              10 Official Tiers
            </span>
          </div>

          <div className="space-y-2.5">
            {ROLES.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-background/40 border border-border/40"
              >
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.tone }} />
                    {r.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.description}</div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-primary px-2.5 py-1 rounded-lg glass border border-primary/20">
                    Tier {i + 1} · {r.short}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="glass rounded-2xl p-6 border border-border/40">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" /> Command Shortcuts
            </h2>
            <ul className="text-sm space-y-3">
              <li className="flex justify-between items-center py-1 border-b border-border/20">
                <span className="text-muted-foreground">Open Command Center</span>
                <kbd className="font-mono text-xs border border-border/60 glass rounded px-2 py-1 font-semibold">
                  ⌘ K / Ctrl+K
                </kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-border/20">
                <span className="text-muted-foreground">Close Command Modal</span>
                <kbd className="font-mono text-xs border border-border/60 glass rounded px-2 py-1 font-semibold">
                  ESC
                </kbd>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-border/20">
                <span className="text-muted-foreground">Search Modules</span>
                <kbd className="font-mono text-xs border border-border/60 glass rounded px-2 py-1 font-semibold">
                  /
                </kbd>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Download Form-A PDF</span>
                <kbd className="font-mono text-xs border border-border/60 glass rounded px-2 py-1 font-semibold">
                  ⌘ P
                </kbd>
              </li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 border border-border/40 text-xs space-y-3">
            <div className="font-bold text-foreground flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-primary" /> State Environmental Helplines
            </div>
            <div className="space-y-1.5 text-muted-foreground leading-relaxed">
              <div><strong className="text-foreground">GPCB Central Control Room:</strong> 1800-233-1234 (Toll-Free)</div>
              <div><strong className="text-foreground">Vapi Regional Office:</strong> 0260-2432924</div>
              <div><strong className="text-foreground">Ankleshwar Regional Office:</strong> 02646-221345</div>
              <div><strong className="text-foreground">Surat Regional Office:</strong> 0261-2465801</div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}