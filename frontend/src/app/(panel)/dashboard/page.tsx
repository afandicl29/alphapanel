'use client';

import { motion } from 'framer-motion';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Users,
  Globe,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts';
import { RealtimeBadge } from '@/components/dashboard/realtime-badge';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ServiceStatus } from '@/components/dashboard/service-status';
import { useRealtimeMetrics } from '@/components/dashboard/use-realtime-metrics';
import { useAuth } from '@/components/providers/auth-provider';

function formatBytes(n: number) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} GB`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} MB`;
  return `${(n / 1e3).toFixed(0)} KB`;
}

const summaryStats: { label: string; value: string; icon: LucideIcon }[] = [
  { label: 'Hosting', value: '12', icon: Server },
  { label: 'Domains', value: '28', icon: Globe },
  { label: 'Accounts', value: '8', icon: Users },
];

export default function DashboardPage() {
  const { metrics, history, connected, lastUpdate } = useRealtimeMetrics();
  const { user } = useAuth();
  const ramPct = metrics.ramTotal ? Math.round((metrics.ramUsed / metrics.ramTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-alpha-gradient p-6 text-white shadow-xl shadow-blue-600/20 sm:p-8"
      >
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Welcome back</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
              {user?.displayName || user?.username || 'Administrator'}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-blue-100/90">
              AlphaPanel server overview — monitor resources, manage hosting, and deploy apps in one place.
            </p>
          </div>
          <RealtimeBadge connected={connected} lastUpdate={lastUpdate} />
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="CPU Load"
          value={`${metrics.cpu.toFixed(1)}%`}
          subtitle="All processor cores"
          icon={Cpu}
          percent={metrics.cpu}
          variant="cpu"
          delay={0}
        />
        <MetricCard
          title="Memory"
          value={`${ramPct}%`}
          subtitle={`${metrics.ramUsed} / ${metrics.ramTotal} MB RAM`}
          icon={MemoryStick}
          percent={ramPct}
          variant="ram"
          delay={0.05}
        />
        <MetricCard
          title="Disk Space"
          value={`${metrics.diskUsedPercent}%`}
          subtitle="Root filesystem"
          icon={HardDrive}
          percent={metrics.diskUsedPercent}
          variant="disk"
          delay={0.1}
        />
        <MetricCard
          title="Network I/O"
          value={formatBytes(metrics.networkRx)}
          subtitle={`↑ ${formatBytes(metrics.networkTx)} sent`}
          icon={Network}
          variant="network"
          delay={0.15}
        />
      </div>

      <AnalyticsCharts data={history} diskUsed={metrics.diskUsedPercent} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <QuickActions />
          <div className="grid gap-4 sm:grid-cols-3">
            {summaryStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="cpanel-stat-card flex items-center gap-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="space-y-6">
          <ServiceStatus apiOnline={connected} />
          <div className="cpanel-panel bg-alpha-gradient p-6 text-white">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <h3 className="font-semibold">AlphaPanel</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-blue-50/95">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Self-hosted · No license
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Realtime monitoring
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Dark mode supported
              </li>
              <li className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'}`}
                />
                Socket {connected ? 'connected' : 'fallback polling'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
