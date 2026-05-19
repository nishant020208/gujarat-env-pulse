import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, UserPlus, Upload, Trash2, Pause, Play, Search, Globe, Ban,
  CheckCircle2, AlertTriangle, RefreshCw, Download, Filter,
} from "lucide-react";
import { PageShell } from "@/components/hppe/PageShell";
import { ROLES, type RoleId } from "@/lib/hppe/roles";
import {
  readPolicy, writePolicy, resetPolicy,
  type AccessEntry, type AccessStatus, type AccessPolicy,
} from "@/lib/hppe/access";
import { useAuth } from "@/components/hppe/useAuth";

export const Route = createFileRoute("/access")({
  head: () => ({ meta: [{ title: "Access Control Center · HPEE" }] }),
  component: AccessPage,
});

const STATUS_TONE: Record<AccessStatus, string> = {
  active: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  suspended: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  pending: "text-sky-300 bg-sky-500/10 border-sky-500/30",
  blacklisted: "text-red-300 bg-red-500/10 border-red-500/30",
};

function AccessPage() {
  const { session } = useAuth();
  const [policy, setPolicy] = useState<AccessPolicy>(() => readPolicy());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccessStatus | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const sync = () => setPolicy(readPolicy());
    window.addEventListener("hppe-access", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hppe-access", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const persist = (next: AccessPolicy) => { writePolicy(next); setPolicy(next); };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return policy.entries
      .filter((e) => statusFilter === "all" || e.status === statusFilter)
      .filter((e) => !q || e.email.toLowerCase().includes(q) || (e.district ?? "").toLowerCase().includes(q))
      .sort((a, b) => b.addedAt - a.addedAt);
  }, [policy.entries, query, statusFilter]);

  const stats = useMemo(() => ({
    total: policy.entries.length,
    active: policy.entries.filter((e) => e.status === "active").length,
    suspended: policy.entries.filter((e) => e.status === "suspended").length,
    blacklisted: policy.entries.filter((e) => e.status === "blacklisted").length,
  }), [policy.entries]);

  const updateEntry = (email: string, patch: Partial<AccessEntry>) => {
    persist({
      ...policy,
      entries: policy.entries.map((e) => (e.email === email ? { ...e, ...patch } : e)),
    });
  };
  const removeEntry = (email: string) => {
    if (!confirm(`Revoke access for ${email}?`)) return;
    persist({ ...policy, entries: policy.entries.filter((e) => e.email !== email) });
  };
  const addEntry = (entry: AccessEntry) => {
    if (policy.entries.some((e) => e.email.toLowerCase() === entry.email.toLowerCase())) {
      alert("Email already exists in the access list.");
      return;
    }
    persist({ ...policy, entries: [entry, ...policy.entries] });
  };

  const bulkImport = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const header = lines.shift()?.toLowerCase() ?? "";
    if (!header.includes("email")) { alert("CSV must include 'email' header (and optional 'role','district')."); return; }
    const cols = header.split(",").map((c) => c.trim());
    const iEmail = cols.indexOf("email");
    const iRole = cols.indexOf("role");
    const iDistrict = cols.indexOf("district");
    const additions: AccessEntry[] = [];
    for (const line of lines) {
      const parts = line.split(",").map((p) => p.trim());
      const email = parts[iEmail];
      if (!email) continue;
      if (policy.entries.some((e) => e.email.toLowerCase() === email.toLowerCase())) continue;
      const role = (iRole >= 0 ? (parts[iRole] as RoleId) : "public") || "public";
      additions.push({
        email, role,
        status: "active",
        addedBy: session?.email ?? "admin",
        addedAt: Date.now(),
        whitelisted: true,
        district: iDistrict >= 0 ? parts[iDistrict] : undefined,
      });
    }
    if (!additions.length) { alert("No new emails imported."); return; }
    persist({ ...policy, entries: [...additions, ...policy.entries] });
    setBulkOpen(false);
  };

  const exportCsv = () => {
    const rows = ["email,role,status,district,whitelisted,addedAt,lastLogin"];
    for (const e of policy.entries) {
      rows.push([e.email, e.role, e.status, e.district ?? "", e.whitelisted, e.addedAt, e.lastLogin ?? ""].join(","));
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `hppe-access-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell
      path="/access"
      requireRoles={["super_admin", "gspcb_admin"]}
      title="Authorized Access Control Center"
      eyebrow="Administration"
      icon={ShieldCheck}
      description="Whitelist, suspend, and audit every account permitted to operate the HPEE platform."
      actions={
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setBulkOpen(true)} className="px-3 py-2 rounded-lg glass text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" /> Bulk import
          </button>
          <button onClick={exportCsv} className="px-3 py-2 rounded-lg glass text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setShowAdd(true)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add email
          </button>
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Authorized accounts", value: stats.total, tone: "text-foreground" },
          { label: "Active", value: stats.active, tone: "text-emerald-300" },
          { label: "Suspended", value: stats.suspended, tone: "text-amber-300" },
          { label: "Blacklisted", value: stats.blacklisted, tone: "text-red-300" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.tone}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Domain controls */}
      <div className="glass-strong rounded-2xl p-5 mb-5 grid md:grid-cols-3 gap-4">
        <DomainList
          title="Whitelisted domains"
          icon={<Globe className="w-4 h-4 text-emerald-300" />}
          values={policy.allowedDomains}
          onChange={(v) => persist({ ...policy, allowedDomains: v })}
          placeholder="e.g. gspcb.in"
        />
        <DomainList
          title="Blocked domains"
          icon={<Ban className="w-4 h-4 text-red-300" />}
          values={policy.blockedDomains}
          onChange={(v) => persist({ ...policy, blockedDomains: v })}
          placeholder="e.g. tempmail.com"
        />
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Enforcement
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={policy.requireWhitelist}
              onChange={(e) => persist({ ...policy, requireWhitelist: e.target.checked })}
              className="mt-1 accent-primary"
            />
            <div>
              <div className="text-sm font-medium">Require explicit whitelist</div>
              <div className="text-xs text-muted-foreground">
                If off, any email on a whitelisted domain may sign in. If on, only emails listed below may sign in.
              </div>
            </div>
          </label>
          <button
            onClick={() => { if (confirm("Reset access policy to factory defaults?")) resetPolicy(); }}
            className="mt-3 text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" /> Reset to defaults
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email or organisation…"
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-1 glass rounded-lg p-1">
          <Filter className="w-3.5 h-3.5 text-muted-foreground mx-1" />
          {(["all", "active", "suspended", "pending", "blacklisted"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-2.5 py-1.5 rounded-md transition ${statusFilter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[920px]">
            <thead className="bg-background/40 border-b border-border/40">
              <tr className="text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Email</th>
                <th className="px-3 py-3">Role</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">District</th>
                <th className="px-3 py-3">Last login</th>
                <th className="px-3 py-3">Added by</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.email} className="border-b border-border/20 hover:bg-background/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-medium">{e.email}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {e.whitelisted ? "WL" : "—"} · IP {e.ip ?? "—"}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={e.role}
                      onChange={(ev) => updateEntry(e.email, { role: ev.target.value as RoleId })}
                      className="bg-transparent glass rounded-md px-2 py-1 text-xs"
                    >
                      {ROLES.map((r) => <option key={r.id} value={r.id} className="bg-background">{r.short}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest border px-2 py-1 rounded ${STATUS_TONE[e.status]}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{e.district ?? "—"}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{e.lastLogin ? new Date(e.lastLogin).toLocaleString() : "Never"}</td>
                  <td className="px-3 py-3 text-xs text-muted-foreground">{e.addedBy}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {e.status === "active" ? (
                        <button title="Suspend" onClick={() => updateEntry(e.email, { status: "suspended" })} className="p-1.5 rounded hover:bg-amber-500/10 text-amber-300">
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button title="Activate" onClick={() => updateEntry(e.email, { status: "active" })} className="p-1.5 rounded hover:bg-emerald-500/10 text-emerald-300">
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button title="Blacklist" onClick={() => updateEntry(e.email, { status: "blacklisted" })} className="p-1.5 rounded hover:bg-red-500/10 text-red-300">
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                      <button title="Remove" onClick={() => removeEntry(e.email)} className="p-1.5 rounded hover:bg-red-500/10 text-red-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                    No accounts match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <AddEmailModal
            onClose={() => setShowAdd(false)}
            onSubmit={(e) => { addEntry(e); setShowAdd(false); }}
            addedBy={session?.email ?? "admin"}
          />
        )}
        {bulkOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-background/70 backdrop-blur p-4"
            onClick={() => setBulkOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="font-semibold mb-1">Bulk import emails</h3>
              <p className="text-xs text-muted-foreground mb-4">
                CSV header must include <code className="font-mono">email</code>. Optional columns: <code className="font-mono">role</code>, <code className="font-mono">district</code>.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) bulkImport(f); }}
                className="block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground"
              />
              <div className="text-[10px] text-muted-foreground mt-3 font-mono">
                example: email,role,district<br />
                officer@gspcb.in,inspector,Vapi
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function DomainList({ title, icon, values, onChange, placeholder }: {
  title: string; icon: React.ReactNode; values: string[]; onChange: (v: string[]) => void; placeholder: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim().toLowerCase().replace(/^@/, "");
    if (!v || values.includes(v)) return;
    onChange([...values, v]); setInput("");
  };
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">{icon}{title}</div>
      <div className="flex gap-2 mb-2">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="bg-transparent glass rounded-md px-2 py-1.5 text-xs flex-1 outline-none"
        />
        <button onClick={add} className="text-xs px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground">Add</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((d) => (
          <button
            key={d}
            onClick={() => onChange(values.filter((x) => x !== d))}
            className="text-[11px] font-mono px-2 py-1 rounded-md glass hover:bg-red-500/10 hover:text-red-300 transition"
            title="Remove"
          >
            @{d} ×
          </button>
        ))}
        {values.length === 0 && <div className="text-xs text-muted-foreground">None</div>}
      </div>
    </div>
  );
}

function AddEmailModal({ onClose, onSubmit, addedBy }: {
  onClose: () => void; onSubmit: (e: AccessEntry) => void; addedBy: string;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleId>("public");
  const [district, setDistrict] = useState("");
  const [temp, setTemp] = useState(false);
  const [days, setDays] = useState(7);

  const submit = () => {
    if (!email.includes("@")) { alert("Enter a valid email."); return; }
    onSubmit({
      email: email.trim().toLowerCase(),
      role,
      status: "active",
      addedBy,
      addedAt: Date.now(),
      whitelisted: true,
      district: district || undefined,
      expiresAt: temp ? Date.now() + days * 24 * 60 * 60 * 1000 : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] grid place-items-center bg-background/70 backdrop-blur p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-strong rounded-2xl p-6 w-full max-w-md space-y-3"
      >
        <h3 className="font-semibold">Authorize new email</h3>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="officer@gspcb.in"
          className="w-full bg-transparent glass rounded-lg px-3 py-2 text-sm outline-none" />
        <select value={role} onChange={(e) => setRole(e.target.value as RoleId)}
          className="w-full bg-transparent glass rounded-lg px-3 py-2 text-sm outline-none">
          {ROLES.map((r) => <option key={r.id} value={r.id} className="bg-background">{r.name}</option>)}
        </select>
        <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District / organisation (optional)"
          className="w-full bg-transparent glass rounded-lg px-3 py-2 text-sm outline-none" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={temp} onChange={(e) => setTemp(e.target.checked)} className="accent-primary" />
          Temporary access
          {temp && (
            <input type="number" value={days} min={1} max={365}
              onChange={(e) => setDays(parseInt(e.target.value) || 7)}
              className="w-16 bg-transparent glass rounded-md px-2 py-1 text-xs ml-2" />
          )}
          {temp && <span className="text-xs text-muted-foreground">days</span>}
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={submit} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Authorize
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// silence unused warning
void AlertTriangle;