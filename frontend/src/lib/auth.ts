export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'RESELLER' | 'USER';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: AuthUser;
}

const ACCESS_KEY = 'alphapanel_access';
const REFRESH_KEY = 'alphapanel_refresh';
const USER_KEY = 'alphapanel_user';

export function setAuth(tokens: AuthTokens) {
  if (typeof window === 'undefined') return;
  const accessMax = 60 * 60; // 1h cookie buffer
  const refreshMax = 60 * 60 * 24 * 7;
  document.cookie = `${ACCESS_KEY}=${tokens.accessToken}; path=/; max-age=${accessMax}; SameSite=Lax`;
  document.cookie = `${REFRESH_KEY}=${tokens.refreshToken}; path=/; max-age=${refreshMax}; SameSite=Lax`;
  localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(tokens.user));
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  document.cookie = `${ACCESS_KEY}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_KEY}=; path=/; max-age=0`;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAdmin(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

export function isReseller(role: UserRole): boolean {
  return isAdmin(role) || role === 'RESELLER';
}

export function roleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    RESELLER: 'Reseller',
    USER: 'User',
  };
  return map[role] ?? role;
}
