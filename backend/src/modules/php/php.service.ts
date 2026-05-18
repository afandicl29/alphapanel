import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class PhpService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  listVersions() {
    return this.prisma.phpVersion.findMany({ where: { isActive: true } });
  }

  setSelector(hostingAccountId: string, version: string) {
    return this.daemon.execute({
      action: 'php.selector',
      payload: { hostingAccountId, version },
    });
  }

  manageExtension(version: string, extension: string, enabled: boolean) {
    return this.daemon.execute({
      action: 'php.extension',
      payload: { version, extension, enabled },
    });
  }
}
