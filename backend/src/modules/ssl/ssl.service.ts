import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class SslService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  list() {
    return this.prisma.sslCertificate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async issueLetsEncrypt(domainName: string, hostingAccountId?: string) {
    const result = await this.daemon.execute({
      action: 'ssl.letsencrypt',
      payload: { domain: domainName },
    });
    return this.prisma.sslCertificate.create({
      data: {
        domainName,
        type: 'LETS_ENCRYPT',
        status: result.success ? 'ACTIVE' : 'FAILED',
        autoRenew: true,
        hostingAccountId,
      },
    });
  }

  async uploadManual(domainName: string, certificate: string, privateKey: string, chain?: string) {
    return this.prisma.sslCertificate.create({
      data: {
        domainName,
        type: 'MANUAL',
        status: 'ACTIVE',
        certificate,
        privateKey,
        chain,
        autoRenew: false,
      },
    });
  }
}
