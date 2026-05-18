import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class InstallersService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  list() {
    return this.prisma.oneClickApp.findMany({ where: { isActive: true } });
  }

  install(slug: string, hostingAccountId: string, domain: string) {
    return this.daemon.execute({
      action: 'installer.run',
      payload: { slug, hostingAccountId, domain },
    });
  }
}
