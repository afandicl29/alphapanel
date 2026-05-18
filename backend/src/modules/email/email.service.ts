import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class EmailService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  list(hostingAccountId: string) {
    return this.prisma.emailAccount.findMany({ where: { hostingAccountId } });
  }

  async create(hostingAccountId: string, address: string, password: string, quotaMb = 1024) {
    const hash = await bcrypt.hash(password, 12);
    await this.daemon.execute({ action: 'email.create', payload: { address, hostingAccountId } });
    return this.prisma.emailAccount.create({
      data: { address, passwordHash: hash, hostingAccountId, quotaMb },
    });
  }

  async configureDns(domain: string) {
    return this.prisma.emailDnsConfig.upsert({
      where: { domain },
      create: {
        domain,
        spfRecord: 'v=spf1 mx ~all',
        dmarcRecord: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@' + domain,
      },
      update: {},
    });
  }
}
