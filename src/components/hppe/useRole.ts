import { useEffect, useState, useCallback } from "react";
import type { RoleId } from "@/lib/hppe/roles";

const KEY = "hppe.role";
const DEFAULT: RoleId = "super_admin";

type Listener = (r: RoleId) => void;
const listeners = new Set<Listener>();

export function useRole() {
  const [role, setRoleState] = useState<RoleId>(() => {
    if (typeof window === "undefined") return DEFAULT;
    return (localStorage.getItem(KEY) as RoleId) || DEFAULT;
  });

  useEffect(() => {
    const fn: Listener = (r) => setRoleState(r);
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const setRole = useCallback((r: RoleId) => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, r);
    listeners.forEach((l) => l(r));
  }, []);

  return { role, setRole };
}