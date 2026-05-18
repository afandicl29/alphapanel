import { Body, Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@UseGuards(RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('users')
  users() {
    return this.admin.users();
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() body: { role?: UserRole; status?: UserStatus }) {
    return this.admin.updateUser(id, body);
  }

  @Get('servers')
  servers() {
    return this.admin.servers();
  }

  @Get('activity')
  activity() {
    return this.admin.activityLogs();
  }
}
