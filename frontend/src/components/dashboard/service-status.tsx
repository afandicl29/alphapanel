'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const services = [
  { name: 'Nginx', status: 'running' as const },
  { name: 'MariaDB', status: 'running' as const },
  { name: 'Redis', status: 'running' as const },
  { name: 'AlphaPanel API', status: 'running' as const },
  { name: 'PHP-FPM 8.3', status: 'running' as const },
  { name: 'Fail2Ban', status: 'running' as const },
];

export function ServiceStatus({ apiOnline = true }: { apiOnline?: boolean }) {
  const list = services.map((s, i) =>
    i === 3 ? { ...s, status: apiOnline ? ('running' as const) : ('stopped' as const) } : s,
  );

  return (
    <div className="cpanel-panel p-4 sm:p-6">
      <h3 className="mb-4 text-lg font-semibold">Services</h3>
      <ul className="space-y-2">
        {list.map((svc, i) => (
          <motion.li
            key={svc.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5"
          >
            <span className="text-sm font-medium">{svc.name}</span>
            <span
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium',
                svc.status === 'running' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
              )}
            >
              {svc.status === 'running' ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              {svc.status === 'running' ? 'Running' : 'Stopped'}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
