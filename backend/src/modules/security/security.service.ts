import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  firewallRules() {
    return this.prisma.firewallRule.findMany();
  }

  addFirewallRule(data: { name: string; port: number; protocol?: string; action?: string; sourceIp?: string }) {
    return this.prisma.firewallRule.create({ data });
  }

  blockedIps() {
    return this.prisma.blockedIp.findMany();
  }

  blockIp(ipAddress: string, reason?: string, expiresAt?: Date) {
    return this.prisma.blockedIp.upsert({
      where: { ipAddress },
      create: { ipAddress, reason, expiresAt },
      update: { reason, expiresAt },
    });
  }

  fail2banJails() {
    return this.prisma.fail2BanJail.findMany();
  }

  syncFail2ban() {
    return this.daemon.execute({ action: 'fail2ban.sync', payload: {} });
  }

  loginHistory(userId?: string) {
    return this.prisma.loginHistory.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
