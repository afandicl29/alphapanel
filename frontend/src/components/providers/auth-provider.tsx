'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  AuthUser,
  AuthTokens,
  clearAuth,
  getStoredUser,
  isAdmin as checkIsAdminRole,
  isReseller as checkIsResellerRole,
  setAuth,
} from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isReseller: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; username: string; password: string; displayName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await api<AuthUser & { status: string }>('/auth/me');
      setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
        displayName: profile.displayName,
        role: profile.role,
      });
    } catch {
      clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      refreshProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await api<AuthTokens>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuth(tokens);
      setUser(tokens.user);
      router.push('/dashboard');
    },
    [router],
  );

  const register = useCallback(
    async (data: { email: string; username: string; password: string; displayName?: string }) => {
      const tokens = await api<AuthTokens>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setAuth(tokens);
      setUser(tokens.user);
      router.push('/dashboard');
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch {
      /* ignore */
    }
    clearAuth();
    setUser(null);
    router.push('/login');
  }, [router]);

  const logoutAll = useCallback(async () => {
    try {
      await api('/auth/logout-all', { method: 'POST' });
    } catch {
      /* ignore */
    }
    clearAuth();
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user ? checkIsAdminRole(user.role) : false,
      isReseller: user ? checkIsResellerRole(user.role) : false,
      login,
      register,
      logout,
      logoutAll,
      refreshProfile,
    }),
    [user, loading, login, register, logout, logoutAll, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
