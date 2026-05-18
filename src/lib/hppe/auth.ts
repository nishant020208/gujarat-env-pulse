import type { RoleId } from "./roles";

export interface DemoAccount {
  email: string;
  password: string;
  name: string;
  role: RoleId;
  organisation: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { email: "admin@hppe.gov.in",     password: "Hppe@2026",   name: "K. Patel",      role: "super_admin", organisation: "HPEE Platform Ops" },
  { email: "gspcb@hppe.gov.in",     password: "Gspcb@2026",  name: "R. Mehta",      role: "gspcb_admin", organisation: "Gujarat Pollution Control Board" },
  { email: "inspector@hppe.gov.in", password: "Field@2026",  name: "S. Joshi",      role: "inspector",   organisation: "GSPCB Vapi Regional Office" },
  { email: "sarpanch@hppe.gov.in",  password: "Gram@2026",   name: "H. Vaghela",    role: "sarpanch",    organisation: "Sarigam Gram Panchayat" },
  { email: "analyst@hppe.gov.in",   password: "Data@2026",   name: "P. Iyer",       role: "analyst",     organisation: "HPEE Intelligence Cell" },
  { email: "emergency@hppe.gov.in", password: "Ero@2026",    name: "A. Solanki",    role: "emergency",   organisation: "District Emergency Ops" },
  { email: "district@hppe.gov.in",  password: "Dmo@2026",    name: "N. Chaudhary",  role: "district",    organisation: "Bharuch District Monitoring" },
  { email: "industry@hppe.gov.in",  password: "Comply@2026", name: "V. Shah",       role: "industry",    organisation: "Ankleshwar Industries Assoc." },
  { email: "maintenance@hppe.gov.in", password: "Mesh@2026", name: "D. Rathod",     role: "maintenance", organisation: "HPEE Field Engineering" },
  { email: "public@hppe.gov.in",    password: "Public@2026", name: "Citizen User",  role: "public",      organisation: "Community" },
];

export interface Session {
  email: string;
  name: string;
  role: RoleId;
  organisation: string;
  issuedAt: number;
}

const KEY = "hppe.session.v1";

export function authenticate(email: string, password: string): Session | null {
  const acc = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );
  if (!acc) return null;
  return { email: acc.email, name: acc.name, role: acc.role, organisation: acc.organisation, issuedAt: Date.now() };
}

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function writeSession(s: Session | null) {
  if (typeof window === "undefined") return;
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("hppe-session"));
}
