import { Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  users() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateUser(id: string, data: { role?: UserRole; status?: UserStatus }) {
    return this.prisma.user.update({ where: { id }, data });
  }

  servers() {
    return this.prisma.server.findMany();
  }

  activityLogs(limit = 100) {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { username: true, email: true } } },
    });
  }

  logActivity(userId: string | null, action: string, resource?: string, resourceId?: string, metadata?: object, ip?: string) {
    return this.prisma.activityLog.create({
      data: { userId: userId ?? undefined, action, resource, resourceId, metadata, ipAddress: ip },
    });
  }
}
