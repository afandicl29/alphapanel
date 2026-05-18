'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  percent?: number;
  delay?: number;
  variant?: 'default' | 'cpu' | 'ram' | 'disk' | 'network';
}

const variantStyles = {
  default: 'from-sky-500 to-blue-600',
  cpu: 'from-cyan-400 to-blue-600',
  ram: 'from-blue-500 to-indigo-600',
  disk: 'from-indigo-500 to-violet-600',
  network: 'from-sky-400 to-blue-500',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  percent,
  delay = 0,
  variant = 'default',
}: MetricCardProps) {
  const barColor = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className="cpanel-stat-card group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{value}</p>
          {subtitle && <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105',
            barColor,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {percent !== undefined && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Usage</span>
            <span>{Math.min(percent, 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted/80">
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', barColor)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percent, 100)}%` }}
              transition={{ delay: delay + 0.15, duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
