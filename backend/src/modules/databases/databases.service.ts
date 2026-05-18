import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DaemonClientService } from '../../daemon/daemon-client.service';

@Injectable()
export class DatabasesService {
  constructor(private prisma: PrismaService, private daemon: DaemonClientService) {}

  list(hostingAccountId: string) {
    return this.prisma.databaseInstance.findMany({
      where: { hostingAccountId },
      include: { users: true },
    });
  }

  async create(hostingAccountId: string, name: string) {
    await this.daemon.execute({ action: 'database.create', payload: { hostingAccountId, name } });
    return this.prisma.databaseInstance.create({ data: { name, hostingAccountId } });
  }

  async createUser(databaseId: string, username: string, password: string) {
    await this.daemon.execute({ action: 'database.user.create', payload: { databaseId, username } });
    return this.prisma.databaseUser.create({ data: { databaseId, username, password } });
  }

  backup(databaseId: string) {
    return this.daemon.execute({ action: 'database.backup', payload: { databaseId } });
  }

  restore(databaseId: string, backupPath: string) {
    return this.daemon.execute({ action: 'database.restore', payload: { databaseId, backupPath } });
  }

  phpMyAdminUrl(hostingAccountId: string) {
    return { url: `/phpmyadmin/?account=${hostingAccountId}` };
  }
}
