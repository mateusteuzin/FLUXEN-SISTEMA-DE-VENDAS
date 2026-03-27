import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isLocalMode } from '@/lib/app-mode';
import {
  getLocalSession,
  signInLocal,
  signOutLocal,
  signUpLocal,
  type AppSession,
  type AppUser,
} from '@/lib/local-db';

interface AuthContextType {
  session: AppSession | null;
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLocalMode) {
      const currentSession = getLocalSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    const mapSession = (value: { user: { id: string; email?: string | null } } | null): AppSession | null => {
      if (!value?.user) return null;

      return {
        user: {
          id: value.user.id,
          email: value.user.email ?? '',
        },
      };
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const mappedSession = mapSession(nextSession);
      setSession(mappedSession);
      setUser(mappedSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      const mappedSession = mapSession(nextSession);
      setSession(mappedSession);
      setUser(mappedSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isLocalMode) {
      const nextSession = signInLocal(email, password);
      setSession(nextSession);
      setUser(nextSession.user);
      return;
    }

    if (!supabase) {
      throw new Error('Supabase nao configurado.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    if (isLocalMode) {
      const nextSession = signUpLocal(email, password);
      setSession(nextSession);
      setUser(nextSession.user);
      return;
    }

    if (!supabase) {
      throw new Error('Supabase nao configurado.');
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    if (isLocalMode) {
      signOutLocal();
      setSession(null);
      setUser(null);
      return;
    }

    if (!supabase) {
      throw new Error('Supabase nao configurado.');
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
