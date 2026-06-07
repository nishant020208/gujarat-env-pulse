import { useEffect, useState, useCallback } from "react";
import {
  readSession, writeSession, authenticateWithPolicy, signUpForApproval,
  type Session, type AuthResult, type SignUpResult,
} from "@/lib/hppe/auth";
import { supabase } from "@/integrations/supabase/client";

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

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const result = await authenticateWithPolicy(email, password);
    if (result.ok && result.session) writeSession(result.session);
    return result;
  }, []);

  const signUp = useCallback(
    (fullName: string, email: string, password: string): Promise<SignUpResult> =>
      signUpForApproval(fullName, email, password),
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut().catch(() => {});
    writeSession(null);
  }, []);

  return { session, login, signUp, logout, isAuthed: !!session };
}
