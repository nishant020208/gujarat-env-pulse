import { useEffect, useState, useCallback } from "react";
import { readSession, writeSession, authenticateWithPolicy, type Session, type AuthResult } from "@/lib/hppe/auth";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(() => readSession());
  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener("hppe-session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hppe-session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const login = useCallback((email: string, password: string): AuthResult => {
    const result = authenticateWithPolicy(email, password);
    if (result.ok && result.session) writeSession(result.session);
    return result;
  }, []);
  const logout = useCallback(() => writeSession(null), []);
  return { session, login, logout, isAuthed: !!session };
}
