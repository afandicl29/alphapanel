import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  findByUser(userId: string) {
    return this.prisma.domain.findMany({
      where: { userId },
      include: { subdomains: true, dnsRecords: true, redirects: true },
    });
  }

  async create(userId: string, name: string, hostingAccountId?: string) {
    await this.daemon.execute({ action: 'domain.add', payload: { name } });
    return this.prisma.domain.create({
      data: { name, userId, hostingAccountId, isPrimary: true },
    });
  }

  async addSubdomain(domainId: string, name: string, documentRoot?: string) {
    const domain = await this.prisma.domain.findUnique({ where: { id: domainId } });
    if (!domain) throw new NotFoundException();
    await this.daemon.execute({
      action: 'subdomain.add',
      payload: { domain: domain.name, subdomain: name },
    });
    return this.prisma.subdomain.create({ data: { domainId, name, documentRoot } });
  }

  async updateDns(domainId: string, records: { type: string; name: string; content: string; ttl?: number }[]) {
    await this.prisma.dnsRecord.deleteMany({ where: { domainId } });
    await this.daemon.execute({ action: 'dns.sync', payload: { domainId, records } });
    return this.prisma.dnsRecord.createMany({
      data: records.map((r) => ({ ...r, domainId, ttl: r.ttl ?? 3600 })),
    });
  }

  async addRedirect(domainId: string, sourcePath: string, targetUrl: string, statusCode = 301) {
    await this.daemon.execute({
      action: 'domain.redirect',
      payload: { domainId, sourcePath, targetUrl, statusCode },
    });
    return this.prisma.domainRedirect.create({
      data: { domainId, sourcePath, targetUrl, statusCode },
    });
  }
}
