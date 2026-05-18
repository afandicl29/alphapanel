'use client';

import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, LogOut, User, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { roleLabel } from '@/lib/auth';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/hosting': 'Hosting',
  '/domains': 'Domains',
  '/ssl': 'SSL / TLS',
  '/files': 'File Manager',
  '/databases': 'Databases',
  '/email': 'Email',
  '/docker': 'Docker',
  '/backups': 'Backups',
  '/monitoring': 'Monitoring',
  '/terminal': 'Terminal',
  '/admin': 'Admin',
  '/account/sessions': 'Sessions',
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const { user, logout, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([k]) => pathname.startsWith(k))?.[1] ??
    'AlphaPanel';

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold sm:text-xl">
              <span className="bg-alpha-gradient bg-clip-text text-transparent">{title}</span>
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">AlphaPanel Control</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {!loading && user && (
            <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 md:flex">
              <User className="h-3.5 w-3.5 text-primary" />
              <span className="max-w-[100px] truncate text-xs font-medium">{user.username}</span>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                {roleLabel(user.role)}
              </span>
            </div>
          )}

          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
          >
            {mounted && (
              <>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </>
            )}
          </Button>

          <Button variant="outline" size="icon" onClick={() => logout()} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
