"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ApiService } from "@/services/api";
import type { UserProfile } from "@/types";

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = (await ApiService.getMe()) as UserProfile;
      setUser(me);
    } catch (err: unknown) {
      const detail =
        (err as { detail?: string; title?: string })?.detail ??
        (err as { title?: string })?.title ??
        "Kullanıcı bilgisi alınamadı.";
      setError(detail);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, error, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useCurrentUser(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useCurrentUser must be used within <AuthProvider>");
  }
  return ctx;
}
