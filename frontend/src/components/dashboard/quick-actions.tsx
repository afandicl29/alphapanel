'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Server,
  Globe,
  Shield,
  FolderOpen,
  Database,
  Mail,
  HardDrive,
  Container,
} from 'lucide-react';

const actions = [
  { href: '/hosting', label: 'Hosting', desc: 'Accounts', icon: Server, color: 'from-blue-500 to-blue-700' },
  { href: '/domains', label: 'Domains', desc: 'DNS & SSL', icon: Globe, color: 'from-sky-500 to-blue-600' },
  { href: '/ssl', label: 'SSL', desc: 'Certificates', icon: Shield, color: 'from-cyan-500 to-blue-600' },
  { href: '/files', label: 'Files', desc: 'Manager', icon: FolderOpen, color: 'from-indigo-500 to-blue-700' },
  { href: '/databases', label: 'MySQL', desc: 'Databases', icon: Database, color: 'from-violet-500 to-indigo-600' },
  { href: '/email', label: 'Email', desc: 'Accounts', icon: Mail, color: 'from-blue-400 to-indigo-500' },
  { href: '/backups', label: 'Backups', desc: 'Restore', icon: HardDrive, color: 'from-blue-600 to-indigo-700' },
  { href: '/docker', label: 'Docker', desc: 'Containers', icon: Container, color: 'from-sky-600 to-blue-800' },
];

export function QuickActions() {
  return (
    <div className="cpanel-panel p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold">Quick Shortcuts</h3>
      <p className="mb-4 text-sm text-muted-foreground">cPanel-style tools — one click away</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                className="cpanel-shortcut group"
              >
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
