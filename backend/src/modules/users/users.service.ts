import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findResellerTree(parentId: string) {
    return this.prisma.user.findMany({
      where: { parentId },
      select: { id: true, username: true, email: true, role: true, status: true, createdAt: true },
    });
  }
}
