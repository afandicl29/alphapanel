import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.package.findMany({ orderBy: { name: 'asc' } });
  }

  create(data: {
    name: string;
    description?: string;
    diskQuotaMb?: number;
    bandwidthMb?: number;
    maxDomains?: number;
    isReseller?: boolean;
  }) {
    return this.prisma.package.create({ data });
  }
}
