import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';
import type { AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (nik: string, password: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiFetch<{ user: AppUser }>('/auth/me')
      .then((payload) => {
        if (isMounted) setUser(payload.user);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login: async (nik, password) => {
        const payload = await apiFetch<{ user: AppUser }>('/auth/login', {
          method: 'POST',
          body: { nik, password },
        });
        setUser(payload.user);
        return payload.user;
      },
      logout: async () => {
        await apiFetch('/auth/logout', { method: 'POST' });
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
