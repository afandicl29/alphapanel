import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { HostingService } from './hosting.service';
import { CreateHostingDto } from './dto/create-hosting.dto';

@ApiTags('Hosting')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('hosting')
export class HostingController {
  constructor(private hosting: HostingService) {}

  @Get()
  list(@Req() req: Request & { user: { id: string; role: UserRole } }) {
    return this.hosting.findAll(req.user.id, req.user.role);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.RESELLER, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateHostingDto, @Req() req: Request & { user: { id: string } }) {
    return this.hosting.create(dto, req.user.id);
  }

  @Patch(':id/suspend')
  suspend(@Param('id') id: string, @Req() req: Request & { user: { id: string; role: UserRole } }) {
    return this.hosting.setStatus(id, 'SUSPENDED', req.user.id, req.user.role);
  }

  @Patch(':id/unsuspend')
  unsuspend(@Param('id') id: string, @Req() req: Request & { user: { id: string; role: UserRole } }) {
    return this.hosting.setStatus(id, 'ACTIVE', req.user.id, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: { id: string; role: UserRole } }) {
    return this.hosting.remove(id, req.user.id, req.user.role);
  }
}
