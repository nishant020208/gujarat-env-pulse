import { DEMO_ACCOUNTS } from "./auth";
import type { RoleId } from "./roles";

export type AccessStatus = "active" | "suspended" | "pending" | "blacklisted";

export interface AccessEntry {
  email: string;
  role: RoleId;
  status: AccessStatus;
  addedBy: string;
  addedAt: number;
  lastLogin?: number;
  device?: string;
  ip?: string;
  district?: string;
  whitelisted: boolean;
  expiresAt?: number;
  note?: string;
}

export interface AccessPolicy {
  entries: AccessEntry[];
  allowedDomains: string[]; // e.g. ["gspcb.in", "gujarat.gov.in"]
  blockedDomains: string[];
  requireWhitelist: boolean; // if true, only listed emails may sign in
}

const KEY = "hppe.access.v1";

function seed(): AccessPolicy {
  return {
    entries: DEMO_ACCOUNTS.map((a) => ({
      email: a.email,
      role: a.role,
      status: "active",
      addedBy: "system@hppe.gov.in",
      addedAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
      whitelisted: true,
      district: a.organisation,
    })),
    allowedDomains: ["hppe.gov.in", "gspcb.in", "gujarat.gov.in"],
    blockedDomains: [],
    requireWhitelist: true,
  };
}

export function readPolicy(): AccessPolicy {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const p = seed();
      localStorage.setItem(KEY, JSON.stringify(p));
      return p;
    }
    return JSON.parse(raw);
  } catch {
    return seed();
  }
}

export function writePolicy(p: AccessPolicy) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("hppe-access"));
}

export function resetPolicy() {
  if (typeof window === "undefined") return;
  const p = seed();
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("hppe-access"));
}

export type AccessDenialReason =
  | "not_listed"
  | "suspended"
  | "blacklisted"
  | "domain_blocked"
  | "expired"
  | "ok";

export function evaluateAccess(email: string): { allowed: boolean; reason: AccessDenialReason; entry?: AccessEntry } {
  const policy = readPolicy();
  const norm = email.trim().toLowerCase();
  const domain = norm.split("@")[1] ?? "";

  if (policy.blockedDomains.map((d) => d.toLowerCase()).includes(domain)) {
    return { allowed: false, reason: "domain_blocked" };
  }

  const entry = policy.entries.find((e) => e.email.toLowerCase() === norm);
  if (!entry) {
    if (!policy.requireWhitelist && policy.allowedDomains.map((d) => d.toLowerCase()).includes(domain)) {
      return { allowed: true, reason: "ok" };
    }
    return { allowed: false, reason: "not_listed" };
  }

  if (entry.status === "blacklisted") return { allowed: false, reason: "blacklisted", entry };
  if (entry.status === "suspended" || entry.status === "pending") return { allowed: false, reason: "suspended", entry };
  if (entry.expiresAt && entry.expiresAt < Date.now()) return { allowed: false, reason: "expired", entry };
  return { allowed: true, reason: "ok", entry };
}

export function recordLogin(email: string) {
  const policy = readPolicy();
  const norm = email.trim().toLowerCase();
  const entry = policy.entries.find((e) => e.email.toLowerCase() === norm);
  if (!entry) return;
  entry.lastLogin = Date.now();
  entry.device = typeof navigator !== "undefined" ? navigator.userAgent.split(") ")[0].split(" (").slice(-1)[0] ?? "Web" : "Web";
  entry.ip = "—"; // server-side resolution needed; placeholder for demo
  writePolicy(policy);
}

export function denialMessage(reason: AccessDenialReason): string {
  switch (reason) {
    case "not_listed":     return "Your account is not authorized by administration.";
    case "suspended":      return "Your account is suspended. Contact your administrator.";
    case "blacklisted":    return "Access permanently revoked. Contact GSPCB headquarters.";
    case "domain_blocked": return "Your email domain is not permitted on this platform.";
    case "expired":        return "Your temporary access has expired.";
    default:               return "Access denied.";
  }
}