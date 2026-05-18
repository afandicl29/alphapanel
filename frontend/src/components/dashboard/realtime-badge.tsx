'use client';

import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealtimeBadgeProps {
  connected: boolean;
  lastUpdate: Date | null;
}

export function RealtimeBadge({ connected, lastUpdate }: RealtimeBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        connected
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
      )}
    >
      <span className="relative flex h-2 w-2">
        {connected && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            connected ? 'bg-emerald-500' : 'bg-amber-500',
          )}
        />
      </span>
      <Radio className="h-3 w-3" />
      {connected ? 'Live' : 'Polling'}
      {lastUpdate && (
        <span className="text-muted-foreground font-normal hidden sm:inline">
          · {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </motion.div>
  );
}
