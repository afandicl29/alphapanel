import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class MonitoringService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  logs(service?: string, lines = 200) {
    return this.daemon.execute({ action: 'logs.tail', payload: { service, lines } });
  }

  processes() {
    return this.daemon.execute({ action: 'process.list', payload: {} });
  }

  services() {
    return this.daemon.execute({ action: 'services.status', payload: {} });
  }

  cronJobs() {
    return this.prisma.cronJob.findMany();
  }

  createCron(data: { name: string; command: string; schedule: string; hostingAccountId?: string }) {
    return this.prisma.cronJob.create({ data });
  }
}
