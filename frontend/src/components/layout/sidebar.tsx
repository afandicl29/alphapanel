'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Server,
  Globe,
  Shield,
  FolderOpen,
  Database,
  Mail,
  Container,
  HardDrive,
  Terminal,
  Settings,
  Activity,
  KeyRound,
  X,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
};

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Home',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Hosting',
    items: [
      { href: '/hosting', label: 'Accounts', icon: Server },
      { href: '/domains', label: 'Domains', icon: Globe },
      { href: '/ssl', label: 'SSL / TLS', icon: Shield },
      { href: '/email', label: 'Email', icon: Mail },
    ],
  },
  {
    title: 'Files & Data',
    items: [
      { href: '/files', label: 'File Manager', icon: FolderOpen },
      { href: '/databases', label: 'Databases', icon: Database },
      { href: '/backups', label: 'Backups', icon: HardDrive },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { href: '/docker', label: 'Docker', icon: Container },
      { href: '/monitoring', label: 'Monitoring', icon: Activity },
      { href: '/terminal', label: 'Terminal', icon: Terminal },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '/account/sessions', label: 'Sessions', icon: KeyRound },
      { href: '/admin', label: 'Admin', icon: Settings, adminOnly: true },
    ],
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function SidebarContent({
  collapsed,
  onNavigate,
  isAdmin,
  loading,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
  isAdmin: boolean;
  loading: boolean;
}) {
  const pathname = usePathname();

  return (
  <>
      <div className={cn('flex h-16 items-center border-b border-white/10 px-4', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-lg font-bold shadow-inner">
          α
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-base font-bold tracking-tight">AlphaPanel</p>
            <p className="truncate text-[10px] text-blue-100/70">Hosting Control</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 scrollbar-thin">
        {!loading &&
          navSections.map((section) => {
            const items = section.items.filter((item) => !item.adminOnly || isAdmin);
            if (items.length === 0) return null;
            return (
              <div key={section.title} className="mb-4">
                {!collapsed && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-blue-200/50">
                    {section.title}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const active =
                      pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link href={item.href} onClick={onNavigate} title={collapsed ? item.label : undefined}>
                          <motion.div
                            whileHover={{ x: collapsed ? 0 : 3 }}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                              collapsed && 'justify-center px-2',
                              active
                                ? 'bg-white/20 font-medium text-white shadow-inner'
                                : 'text-blue-100/90 hover:bg-white/10 hover:text-white',
                            )}
                          >
                            <Icon className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                          </motion.div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </nav>

      {!collapsed && (
        <div className="border-t border-white/10 p-3 text-[10px] text-blue-100/60">
          AlphaPanel · Self-hosted
        </div>
      )}
  </>
  );
}

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const { isAdmin, loading } = useAuth();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'alpha-sidebar fixed inset-y-0 left-0 z-40 hidden flex-col text-white shadow-2xl transition-[width] duration-300 lg:flex',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        <SidebarContent collapsed={collapsed} isAdmin={isAdmin} loading={loading} />
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')} />
          </button>
        )}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="alpha-sidebar fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col text-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-end border-b border-white/10 p-2">
                <button
                  type="button"
                  onClick={onMobileClose}
                  className="rounded-lg p-2 hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarContent collapsed={false} onNavigate={onMobileClose} isAdmin={isAdmin} loading={loading} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
