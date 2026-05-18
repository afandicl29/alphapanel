'use client';

import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';

export interface LiveMetrics {
  cpu: number;
  ramUsed: number;
  ramTotal: number;
  diskUsedPercent: number;
  networkRx: number;
  networkTx: number;
  timestamp: string;
}

export interface MetricHistoryPoint {
  time: string;
  cpu: number;
  ram: number;
  disk: number;
  networkIn: number;
  networkOut: number;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

const defaultMetrics: LiveMetrics = {
  cpu: 18,
  ramUsed: 4096,
  ramTotal: 16384,
  diskUsedPercent: 38,
  networkRx: 0,
  networkTx: 0,
  timestamp: new Date().toISOString(),
};

function toHistoryPoint(data: LiveMetrics): MetricHistoryPoint {
  const ramPct = data.ramTotal ? Math.round((data.ramUsed / data.ramTotal) * 100) : 0;
  return {
    time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    cpu: Math.round(data.cpu * 10) / 10,
    ram: ramPct,
    disk: Math.round(data.diskUsedPercent),
    networkIn: Math.round(data.networkRx / 1e6),
    networkOut: Math.round(data.networkTx / 1e6),
  };
}

export function useRealtimeMetrics() {
  const [metrics, setMetrics] = useState<LiveMetrics>(defaultMetrics);
  const [history, setHistory] = useState<MetricHistoryPoint[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const pushMetrics = useCallback((data: LiveMetrics) => {
    setMetrics(data);
    setLastUpdate(new Date(data.timestamp));
    setHistory((prev) => [...prev, toHistoryPoint(data)].slice(-36));
  }, []);

  const fetchLive = useCallback(async () => {
    try {
      const data = await api<LiveMetrics>('/metrics/live');
      pushMetrics(data);
    } catch {
      /* API offline — keep last values */
    }
  }, [pushMetrics]);

  useEffect(() => {
    fetchLive();

    const socket: Socket = io(`${WS_URL}/realtime`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('metrics:update', (data: LiveMetrics) => pushMetrics(data));

    const poll = setInterval(fetchLive, 15000);

    return () => {
      clearInterval(poll);
      socket.disconnect();
    };
  }, [fetchLive, pushMetrics]);

  return { metrics, history, connected, lastUpdate };
}
