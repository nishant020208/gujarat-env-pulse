import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Download } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Environmental Compliance & Audit Reports Archive · Gujarat Environment Pulse (HPPE)" },
      {
        name: "description",
        content: "Statutory environmental audit reports, quarterly emission disclosures, and district compliance archives aligned with GPCB and CPCB guidelines.",
      },
      { property: "og:title", content: "Environmental Compliance Reports · Gujarat Environment Pulse" },
      { property: "og:url", content: "https://hppe.gujarat.gov.in/reports" },
    ],
  }),
  component: Page,
});

const REPORTS = [
  { id: "RPT-2026-Q2-VAPI",      title: "Vapi corridor — Q2 emission summary",      pages: 28, size: "1.4 MB" },
  { id: "RPT-2026-04-ANKLE",     title: "Ankleshwar GIDC — April surge analysis",   pages: 16, size: "880 KB" },
  { id: "RPT-2026-VATVA-ESG",    title: "Vatva GIDC — ESG carbon disclosure",       pages: 22, size: "1.1 MB" },
  { id: "RPT-2026-DISTRICT-VAL", title: "Valsad district monitoring report",        pages: 34, size: "1.7 MB" },
];

function Page() {
  return (
    <PageShell path="/reports" title="Regulatory Reports" eyebrow="Intelligence" icon={FileBarChart}
      description="Auto-generated regulatory, ESG and district-level monitoring reports.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{r.id}</div>
              <div className="font-semibold mt-1">{r.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{r.pages} pages · {r.size}</div>
            </div>
            <button className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-2">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}