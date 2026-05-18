import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

export interface HostMetrics {
  cpu: number;
  ramUsed: number;
  ramTotal: number;
  diskUsedPercent: number;
  networkRx: number;
  networkTx: number;
  timestamp: string;
}

@Injectable()
export class MetricsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getLiveMetrics(): Promise<HostMetrics> {
    const cached = await this.redis.getJson<HostMetrics>('alphapanel:metrics:host');
    if (cached) return cached;

    const latest = await this.prisma.metricsSnapshot.findFirst({
      orderBy: { recordedAt: 'desc' },
    });
    if (latest) {
      return {
        cpu: latest.cpuPercent,
        ramUsed: latest.ramUsedMb,
        ramTotal: latest.ramTotalMb,
        diskUsedPercent: latest.diskUsedPercent,
        networkRx: Number(latest.networkRxBytes),
        networkTx: Number(latest.networkTxBytes),
        timestamp: latest.recordedAt.toISOString(),
      };
    }

    return {
      cpu: 0,
      ramUsed: 0,
      ramTotal: 16384,
      diskUsedPercent: 0,
      networkRx: 0,
      networkTx: 0,
      timestamp: new Date().toISOString(),
    };
  }

  async getHistory(hours = 24) {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.prisma.metricsSnapshot.findMany({
      where: { recordedAt: { gte: since } },
      orderBy: { recordedAt: 'asc' },
      take: 500,
    });
  }

  async recordSnapshot(data: HostMetrics) {
    return this.prisma.metricsSnapshot.create({
      data: {
        cpuPercent: data.cpu,
        ramUsedMb: data.ramUsed,
        ramTotalMb: data.ramTotal,
        diskUsedPercent: data.diskUsedPercent,
        networkRxBytes: BigInt(data.networkRx),
        networkTxBytes: BigInt(data.networkTx),
      },
    });
  }
}
