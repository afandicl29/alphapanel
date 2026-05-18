'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, HardDrive, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MetricHistoryPoint } from './use-realtime-metrics';

interface AnalyticsChartsProps {
  data: MetricHistoryPoint[];
  diskUsed: number;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'network', label: 'Network', icon: Wifi },
  { id: 'storage', label: 'Storage', icon: HardDrive },
] as const;

type TabId = (typeof tabs)[number]['id'];

const CHART_COLORS = {
  cpu: '#0ea5e9',
  ram: '#6366f1',
  disk: '#8b5cf6',
  netIn: '#22d3ee',
  netOut: '#3b82f6',
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="flex gap-2">
          <span>{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export function AnalyticsCharts({ data, diskUsed }: AnalyticsChartsProps) {
  const [tab, setTab] = useState<TabId>('overview');
  const chartData = data.length > 0 ? data : generateDemoData();

  const diskPie = [
    { name: 'Used', value: diskUsed },
    { name: 'Free', value: Math.max(0, 100 - diskUsed) },
  ];

  return (
    <div className="cpanel-panel overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="text-lg font-semibold">Analytics</h3>
          <p className="text-sm text-muted-foreground">Realtime server metrics</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  active
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-4 sm:p-6"
        >
          {tab === 'overview' && (
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.cpu} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS.cpu} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CHART_COLORS.ram} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CHART_COLORS.ram} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="cpu" name="CPU %" stroke={CHART_COLORS.cpu} fill="url(#gCpu)" strokeWidth={2} />
                  <Area type="monotone" dataKey="ram" name="RAM %" stroke={CHART_COLORS.ram} fill="url(#gRam)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {tab === 'network' && (
            <div className="h-[280px] w-full sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="networkIn" name="In (MB)" stroke={CHART_COLORS.netIn} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="networkOut" name="Out (MB)" stroke={CHART_COLORS.netOut} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {tab === 'storage' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={diskPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill={CHART_COLORS.disk} />
                      <Cell fill="hsl(var(--muted))" />
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-2xl font-bold text-foreground">{diskUsed}%</p>
                <p className="text-center text-xs text-muted-foreground">Disk used</p>
              </div>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(-12)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="disk" name="Disk %" fill={CHART_COLORS.disk} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function generateDemoData(): MetricHistoryPoint[] {
  return Array.from({ length: 16 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    cpu: 15 + Math.sin(i / 2) * 20 + Math.random() * 10,
    ram: 45 + Math.cos(i / 3) * 15,
    disk: 38 + (i % 5),
    networkIn: Math.round(Math.random() * 80),
    networkOut: Math.round(Math.random() * 40),
  }));
}
