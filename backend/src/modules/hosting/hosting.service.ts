import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { HostingStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';
import { CreateHostingDto } from './dto/create-hosting.dto';

@Injectable()
export class HostingService {
  constructor(
    private prisma: PrismaService,
    private daemon: DaemonClientService,
  ) {}

  async findAll(userId: string, role: UserRole) {
    const where = role === 'USER' ? { userId } : {};
    return this.prisma.hostingAccount.findMany({
      where,
      include: { package: true, server: true, user: { select: { id: true, username: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateHostingDto, ownerId: string) {
    const pkg = await this.prisma.package.findUnique({ where: { id: dto.packageId } });
    if (!pkg) throw new NotFoundException('Package not found');

    const server = await this.prisma.server.findFirst({ where: { isPrimary: true } });
    if (!server) throw new NotFoundException('No primary server configured');

    const result = await this.daemon.execute({
      action: 'hosting.create',
      payload: {
        username: dto.username,
        domain: dto.domain,
        phpVersion: dto.phpVersion ?? '8.3',
      },
    });
    if (!result.success) throw new Error(result.error ?? 'Daemon failed');

    return this.prisma.hostingAccount.create({
      data: {
        username: dto.username,
        domain: dto.domain,
        homePath: `/home/${dto.username}`,
        userId: ownerId,
        packageId: dto.packageId,
        serverId: server.id,
        phpVersion: dto.phpVersion ?? '8.3',
      },
      include: { package: true },
    });
  }

  async setStatus(id: string, status: HostingStatus, userId: string, role: UserRole, reason?: string) {
    const account = await this.findOneOrFail(id, userId, role);
    await this.daemon.execute({
      action: status === 'SUSPENDED' ? 'hosting.suspend' : 'hosting.unsuspend',
      payload: { username: account.username, reason },
    });
    return this.prisma.hostingAccount.update({
      where: { id },
      data: {
        status,
        suspendedAt: status === 'SUSPENDED' ? new Date() : null,
        suspendedReason: reason,
      },
    });
  }

  async remove(id: string, userId: string, role: UserRole) {
    const account = await this.findOneOrFail(id, userId, role);
    await this.daemon.execute({
      action: 'hosting.delete',
      payload: { username: account.username },
    });
    return this.prisma.hostingAccount.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }

  private async findOneOrFail(id: string, userId: string, role: UserRole) {
    const account = await this.prisma.hostingAccount.findUnique({ where: { id } });
    if (!account) throw new NotFoundException();
    if (role === 'USER' && account.userId !== userId) throw new ForbiddenException();
    return account;
  }
}
