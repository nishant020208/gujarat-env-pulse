import { useAuth } from "./useAuth";
import type { RoleId } from "@/lib/hppe/roles";

// Role is derived from the authenticated session (no in-app switching).
export function useRole(): { role: RoleId } {
  const { session } = useAuth();
  return { role: (session?.role ?? "public") as RoleId };
}
