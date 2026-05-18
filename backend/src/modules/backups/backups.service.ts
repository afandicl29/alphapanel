import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class BackupsService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  list() {
    return this.prisma.backup.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async manual(hostingAccountId: string, type: 'FULL' | 'DATABASE' | 'FILES' = 'FULL') {
    const backup = await this.prisma.backup.create({
      data: { name: `manual-${Date.now()}`, type, status: 'RUNNING', hostingAccountId },
    });
    await this.daemon.execute({ action: 'backup.run', payload: { backupId: backup.id } });
    return backup;
  }

  schedule(hostingAccountId: string, cronExpression: string, type: 'FULL' | 'DATABASE' | 'FILES') {
    return this.prisma.backup.create({
      data: {
        name: `scheduled-${hostingAccountId}`,
        type,
        scheduled: true,
        cronExpression,
        hostingAccountId,
      },
    });
  }

  restore(backupId: string) {
    return this.daemon.execute({ action: 'backup.restore', payload: { backupId } });
  }
}
