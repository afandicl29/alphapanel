'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { roleLabel } from '@/lib/auth';

interface SessionItem {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: string;
  lastActiveAt: string;
  createdAt: string;
  current: boolean;
}

export default function SessionsPage() {
  const { user, logoutAll } = useAuth();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSessions() {
    setLoading(true);
    try {
      const data = await api<SessionItem[]>('/auth/sessions');
      setSessions(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSessions();
  }, []);

  async function revokeSession(id: string) {
    await api(`/auth/sessions/${id}`, { method: 'DELETE' });
    await loadSessions();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Session Management</h2>
        <p className="text-muted-foreground text-sm">
          {user && (
            <>
              Signed in as <strong>{user.email}</strong> ({roleLabel(user.role)})
            </>
          )}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active sessions</CardTitle>
          <Button variant="outline" size="sm" onClick={() => logoutAll()}>
            Log out all devices
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions</p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {s.current ? 'Current session' : 'Session'}
                      {s.current && (
                        <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          This device
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      IP: {s.ipAddress ?? 'unknown'} · Last active:{' '}
                      {new Date(s.lastActiveAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {s.userAgent ?? 'Unknown browser'}
                    </p>
                  </div>
                  {!s.current && (
                    <Button variant="outline" size="sm" onClick={() => revokeSession(s.id)}>
                      Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
