import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Role } from "@/lib/database.types";

export type { Role };

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  department?: string;
  rollNumber?: string;
  designation?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Read user directly from session metadata — instant, no DB call needed
function sessionToAuthUser(session: Session): AuthUser {
  const meta = session.user.user_metadata ?? {};
  const email = session.user.email ?? "";
  return {
    id:          session.user.id,
    name:        meta.name        ?? email.split("@")[0],
    role:        (meta.role       ?? "student") as Role,
    email,
    department:  meta.department  ?? undefined,
    rollNumber:  meta.roll_number ?? undefined,
    designation: meta.designation ?? undefined,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  function resolveSession(session: Session | null) {
    if (session) {
      setUser(sessionToAuthUser(session));
    } else {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    // Check existing session immediately on mount
    supabase.auth.getSession().then(({ data }) => resolveSession(data.session));

    // React to login / logout / token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => resolveSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // resolveSession fires automatically via onAuthStateChange
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
