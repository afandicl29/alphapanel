import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DatabasesService } from './databases.service';

@ApiTags('Databases')
@ApiBearerAuth()
@Controller('databases')
export class DatabasesController {
  constructor(private db: DatabasesService) {}

  @Get()
  list(@Query('hostingAccountId') hostingAccountId: string) {
    return this.db.list(hostingAccountId);
  }

  @Post()
  create(@Body() body: { hostingAccountId: string; name: string }) {
    return this.db.create(body.hostingAccountId, body.name);
  }

  @Post(':id/users')
  createUser(@Param('id') id: string, @Body() body: { username: string; password: string }) {
    return this.db.createUser(id, body.username, body.password);
  }

  @Post(':id/backup')
  backup(@Param('id') id: string) {
    return this.db.backup(id);
  }

  @Get('phpmyadmin')
  phpMyAdmin(@Query('hostingAccountId') hostingAccountId: string) {
    return this.db.phpMyAdminUrl(hostingAccountId);
  }
}
