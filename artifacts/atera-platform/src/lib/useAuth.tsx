import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "./supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

async function fetchIsHubAdmin(uid: string): Promise<boolean> {
  try {
    const result = await withTimeout(
      supabase.from("hub_admins").select("user_id").eq("user_id", uid).maybeSingle(),
      8000,
      { data: null, error: new Error("timeout") }
    );
    return result.data !== null && !result.error;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setAdminLoading(true);
        const admin = await fetchIsHubAdmin(s.user.id);
        setIsAdmin(admin);
        setAdminLoading(false);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setAdminLoading(true);
        const admin = await fetchIsHubAdmin(s.user.id);
        setIsAdmin(admin);
        setAdminLoading(false);
      } else {
        setIsAdmin(false);
        setAdminLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-logout after 30 min inactivity
  useEffect(() => {
    if (!user) return;
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { supabase.auth.signOut(); }, 30 * 60 * 1000);
    };
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => { clearTimeout(timer); events.forEach(e => window.removeEventListener(e, reset)); };
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    const timeoutResult = { data: { user: null, session: null }, error: new Error("Request timed out — check your connection and try again.") };
    console.debug("[auth] signIn: calling signInWithPassword…");
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      12000,
      timeoutResult as typeof timeoutResult
    );
    console.debug("[auth] signInWithPassword result:", { user: data?.user?.id ?? null, error: error?.message ?? null });
    if (error) return { error: error.message };

    if (data.user) {
      console.debug("[auth] fetching hub admin status for", data.user.id);
      const admin = await fetchIsHubAdmin(data.user.id);
      console.debug("[auth] isAdmin:", admin);
      if (!admin) {
        await supabase.auth.signOut();
        return { error: "Access not permitted. Contact your administrator." };
      }
      setIsAdmin(true);
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const combinedLoading = loading || adminLoading;

  return (
    <AuthContext.Provider value={{ user, session, loading: combinedLoading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
