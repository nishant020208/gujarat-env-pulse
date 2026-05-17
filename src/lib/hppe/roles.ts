import {
  LayoutDashboard, Map, Bell, Home, Factory, Radio, FileText, BarChart3, Brain,
  FileBarChart, Inbox, Siren, Settings, HelpCircle, ClipboardCheck, Camera,
  Wrench, Activity, Upload, ShieldCheck, TrendingUp, Globe, Users, Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type RoleId =
  | "super_admin"
  | "gspcb_admin"
  | "inspector"
  | "sarpanch"
  | "public"
  | "maintenance"
  | "industry"
  | "emergency"
  | "analyst"
  | "district";

export interface Role {
  id: RoleId;
  name: string;
  short: string;
  tone: string; // oklch color
  description: string;
}

export const ROLES: Role[] = [
  { id: "super_admin", name: "Super Admin",                 short: "SUDO", tone: "oklch(0.82 0.20 165)", description: "Unrestricted access to every module across the platform." },
  { id: "gspcb_admin", name: "GSPCB Admin",                 short: "PCB",  tone: "oklch(0.72 0.18 220)", description: "Gujarat Pollution Control Board headquarters operator." },
  { id: "inspector",   name: "GSPCB Inspector",             short: "INSP", tone: "oklch(0.78 0.20 80)",  description: "Field officer handling assigned complaints and inspections." },
  { id: "sarpanch",    name: "Village Sarpanch",            short: "GRAM", tone: "oklch(0.82 0.20 145)", description: "Village head — files complaints and broadcasts advisories." },
  { id: "public",      name: "Public Citizen",              short: "PUB",  tone: "oklch(0.85 0.10 200)", description: "Community member viewing public air-quality and alerts." },
  { id: "maintenance", name: "Sensor Maintenance Engineer", short: "MNT",  tone: "oklch(0.78 0.18 50)",  description: "Maintains sensor mesh, calibration and field repairs." },
  { id: "industry",    name: "Industry Compliance Officer", short: "IND",  tone: "oklch(0.72 0.18 290)", description: "Industrial unit submitting schedules and compliance reports." },
  { id: "emergency",   name: "Emergency Response Officer",  short: "ERO",  tone: "oklch(0.68 0.25 25)",  description: "Crisis controller for hazard broadcasts and evacuations." },
  { id: "analyst",     name: "Environmental Analyst",       short: "ANL",  tone: "oklch(0.78 0.20 310)", description: "Predictive modelling, trend & seasonal analytics." },
  { id: "district",    name: "District Monitoring Officer", short: "DMO",  tone: "oklch(0.80 0.16 190)", description: "District-wide coverage, comparison and heatmaps." },
];

export interface TabDef {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
  group: "Operations" | "Intelligence" | "Field" | "Communications" | "System";
  roles: RoleId[] | "all";
  description: string;
}

export const TABS: TabDef[] = [
  { id: "dashboard",     label: "Command Center",     icon: LayoutDashboard, to: "/dashboard",     group: "Operations",     roles: "all", description: "Unified live operations console." },
  { id: "map",           label: "Live AQI Map",       icon: Map,             to: "/map",           group: "Operations",     roles: "all", description: "Hyperlocal GIS with plumes and wind vectors." },
  { id: "alerts",        label: "Pollution Alerts",   icon: Bell,            to: "/alerts",        group: "Operations",     roles: ["super_admin","gspcb_admin","inspector","sarpanch","public","emergency","district"], description: "Active surge & threshold breaches." },
  { id: "villages",      label: "Villages",           icon: Home,            to: "/villages",      group: "Operations",     roles: ["super_admin","gspcb_admin","inspector","sarpanch","emergency","analyst","district"], description: "Village registry and per-village AQI." },
  { id: "industries",    label: "Industries",         icon: Factory,         to: "/industries",    group: "Operations",     roles: ["super_admin","gspcb_admin","inspector","analyst","district","industry"], description: "Industrial clusters & active shifts." },
  { id: "sensors",       label: "Sensor Network",     icon: Radio,           to: "/sensors",       group: "Field",          roles: ["super_admin","gspcb_admin","maintenance","district"], description: "Mesh health, battery, calibration." },
  { id: "complaints",    label: "Complaints",         icon: FileText,        to: "/complaints",    group: "Operations",     roles: ["super_admin","gspcb_admin","inspector","sarpanch","emergency"], description: "GSPCB Form-A archive & status." },
  { id: "analytics",     label: "Analytics",          icon: BarChart3,       to: "/analytics",     group: "Intelligence",   roles: ["super_admin","gspcb_admin","analyst","district","industry"], description: "Trends, seasonality, heatmaps." },
  { id: "inference",     label: "AI Inference Center",icon: Brain,           to: "/inference",     group: "Intelligence",   roles: ["super_admin","gspcb_admin","inspector","analyst"], description: "Source-direction inference & reasoning." },
  { id: "reports",       label: "Reports",            icon: FileBarChart,    to: "/reports",       group: "Intelligence",   roles: ["super_admin","gspcb_admin","analyst","district","industry"], description: "Regulatory & ESG report generator." },
  { id: "notifications", label: "Notifications",      icon: Inbox,           to: "/notifications", group: "Communications", roles: "all", description: "Inbox of system & field events." },
  { id: "emergency",     label: "Emergency Center",   icon: Siren,           to: "/emergency",     group: "Communications", roles: ["super_admin","gspcb_admin","emergency","sarpanch","district"], description: "Crisis broadcast & evacuation control." },
  { id: "inspector",     label: "Inspection Desk",    icon: ClipboardCheck,  to: "/inspector",     group: "Field",          roles: ["super_admin","inspector"], description: "Assigned cases & evidence timeline." },
  { id: "field",         label: "Field Uploads",      icon: Camera,          to: "/field",         group: "Field",          roles: ["super_admin","inspector","maintenance"], description: "Photo evidence & site logs." },
  { id: "maintenance",   label: "Maintenance Bay",    icon: Wrench,          to: "/maintenance",   group: "Field",          roles: ["super_admin","maintenance"], description: "Fault detection & repair queue." },
  { id: "industry",      label: "Industry Console",   icon: Upload,          to: "/industry",      group: "Operations",     roles: ["super_admin","industry"], description: "Shift schedules & compliance uploads." },
  { id: "analyst",       label: "Prediction Lab",     icon: TrendingUp,      to: "/analyst",       group: "Intelligence",   roles: ["super_admin","analyst"], description: "Forecasting & industrial risk scoring." },
  { id: "district",      label: "District Overview",  icon: Globe,           to: "/district",      group: "Operations",     roles: ["super_admin","district"], description: "Regional comparison & heatmaps." },
  { id: "sarpanch",      label: "Gram Panchayat",     icon: Users,           to: "/sarpanch",      group: "Operations",     roles: ["super_admin","sarpanch"], description: "Village dashboard for Sarpanch." },
  { id: "broadcast",     label: "Broadcast",          icon: Megaphone,       to: "/broadcast",     group: "Communications", roles: ["super_admin","emergency","sarpanch"], description: "WhatsApp / SMS pollution advisory." },
  { id: "compliance",    label: "Compliance",         icon: ShieldCheck,     to: "/compliance",    group: "Intelligence",   roles: ["super_admin","industry","gspcb_admin"], description: "Industry compliance scoring." },
  { id: "activity",      label: "Activity Log",       icon: Activity,        to: "/activity",      group: "System",         roles: ["super_admin","gspcb_admin"], description: "Audit trail of platform actions." },
  { id: "settings",      label: "Settings",           icon: Settings,        to: "/settings",      group: "System",         roles: "all", description: "Workspace preferences." },
  { id: "help",          label: "Help Center",        icon: HelpCircle,      to: "/help",          group: "System",         roles: "all", description: "Docs, demo accounts, support." },
];

export function tabsForRole(role: RoleId): TabDef[] {
  return TABS.filter((t) => t.roles === "all" || t.roles.includes(role));
}

export function canAccess(role: RoleId, path: string): boolean {
  const tab = TABS.find((t) => t.to === path);
  if (!tab) return true;
  return tab.roles === "all" || tab.roles.includes(role);
}

export function getRole(id: RoleId): Role {
  return ROLES.find((r) => r.id === id) ?? ROLES[0];
}