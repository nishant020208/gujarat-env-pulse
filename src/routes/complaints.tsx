import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { ComplaintGenerator } from "@/components/hppe/ComplaintGenerator";
import { useLiveReadings } from "@/components/hppe/useLiveReadings";
import { useState } from "react";

export const Route = createFileRoute("/complaints")({
  head: () => ({ meta: [{ title: "Complaints · HPEE" }] }),
  component: Page,
});

const ARCHIVE = [
  { id: "GSPCB/2026/A-1042", village: "Sarigam",   status: "Under Inspection", date: "12 May 2026" },
  { id: "GSPCB/2026/A-1018", village: "Piraman",   status: "Resolved",         date: "07 May 2026" },
  { id: "GSPCB/2026/A-0991", village: "Vatva Gam", status: "Action Taken",     date: "29 Apr 2026" },
  { id: "GSPCB/2026/A-0975", village: "Jhagadia",  status: "Pending Review",   date: "22 Apr 2026" },
];

function Page() {
  const { readings } = useLiveReadings(3000);
  const [idx, setIdx] = useState(0);
  const reading = readings[idx % readings.length];
  return (
    <PageShell path="/complaints" title="GSPCB Form-A Complaints" eyebrow="Evidence Archive" icon={FileText}
      description="One-click generation, archive and tracking of legally-formatted Form-A documents.">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border/40 text-sm font-semibold">Complaint Archive</div>
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr className="border-b border-border/40">
                  <th className="text-left p-3">Tracking ID</th>
                  <th className="text-left p-3">Village</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Filed</th>
                </tr>
              </thead>
              <tbody>
                {ARCHIVE.map((c) => (
                  <tr key={c.id} className="border-b border-border/20 hover:bg-muted/20">
                    <td className="p-3 font-mono text-xs">{c.id}</td>
                    <td className="p-3">{c.village}</td>
                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-muted/40">{c.status}</span></td>
                    <td className="p-3 text-right text-xs text-muted-foreground">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <div className="flex gap-2">
            {readings.slice(0, 4).map((r, i) => (
              <button key={r.id} onClick={() => setIdx(i)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs glass ${idx === i ? "border-primary" : ""}`}>
                {r.name.split("-")[0]}
              </button>
            ))}
          </div>
          {reading && <ComplaintGenerator reading={reading} />}
        </div>
      </div>
    </PageShell>
  );
}