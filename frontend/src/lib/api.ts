import { clearAuth, getAccessToken, getRefreshToken, setAuth, type AuthTokens } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearAuth();
    return null;
  }

  const data = (await res.json()) as AuthTokens;
  setAuth(data);
  return data.accessToken;
}

export async function api<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  let token = getAccessToken();

  const doFetch = (accessToken: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
    });

  let res = await doFetch(token);

  if (res.status === 401 && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    token = await refreshPromise;
    if (token) {
      res = await doFetch(token);
    } else if (typeof window !== 'undefined') {
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.message ?? json.error ?? text;
    } catch {
      /* plain text */
    }
    throw new Error(Array.isArray(message) ? message.join(', ') : String(message));
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export { API_URL };
