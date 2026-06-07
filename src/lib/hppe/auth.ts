import type { RoleId } from "./roles";
import type { AccessDenialReason } from "./access";
import { supabase } from "@/integrations/supabase/client";

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
  // legacy demo-fallback (kept for back-compat with any caller still using it)
  const acc = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
  );
  if (!acc) return null;
  return { email: acc.email, name: acc.name, role: acc.role, organisation: acc.organisation, issuedAt: Date.now() };
}

export interface AuthResult {
  ok: boolean;
  session?: Session;
  reason?: AccessDenialReason | "bad_credentials";
  message?: string;
}

/**
 * Cloud-backed sign-in. Validates credentials with Supabase, then enforces
 * the admin-approval workflow stored in the `profiles` table.
 */
export async function authenticateWithPolicy(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) {
    return { ok: false, reason: "bad_credentials", message: error?.message ?? "Credentials not recognised." };
  }
  // Fetch profile + role
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("full_name, email, approval_status").eq("id", data.user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", data.user.id),
  ]);

  if (!profile) {
    await supabase.auth.signOut();
    return { ok: false, reason: "not_listed", message: "Account is missing a profile. Contact admin." };
  }
  if (profile.approval_status !== "approved") {
    await supabase.auth.signOut();
    return {
      ok: false,
      reason: "suspended",
      message: "Your account is awaiting admin approval.",
    };
  }

  const role = (roles?.[0]?.role as RoleId | undefined) ?? "public";
  const demo = DEMO_ACCOUNTS.find((a) => a.role === role);
  const session: Session = {
    email: data.user.email ?? email,
    name: profile.full_name ?? data.user.email ?? "User",
    role,
    organisation: demo?.organisation ?? "HPEE",
    issuedAt: Date.now(),
  };
  return { ok: true, session };
}

export interface SignUpResult { ok: boolean; message: string }

export async function signUpForApproval(
  fullName: string,
  email: string,
  password: string,
): Promise<SignUpResult> {
  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: fullName.trim() },
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
    },
  });
  if (error) return { ok: false, message: error.message };
  // Immediately sign out — pending users must wait for admin approval.
  await supabase.auth.signOut();
  return { ok: true, message: "Registration submitted. Your account is pending admin approval." };
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
