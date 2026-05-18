import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BackupsService } from './backups.service';

@ApiTags('Backups')
@ApiBearerAuth()
@Controller('backups')
export class BackupsController {
  constructor(private backups: BackupsService) {}

  @Get()
  list() {
    return this.backups.list();
  }

  @Post('manual')
  manual(@Body() body: { hostingAccountId: string; type?: 'FULL' | 'DATABASE' | 'FILES' }) {
    return this.backups.manual(body.hostingAccountId, body.type);
  }

  @Post('schedule')
  schedule(@Body() body: { hostingAccountId: string; cronExpression: string; type: 'FULL' | 'DATABASE' | 'FILES' }) {
    return this.backups.schedule(body.hostingAccountId, body.cronExpression, body.type);
  }

  @Post(':id/restore')
  restore(@Param('id') id: string) {
    return this.backups.restore(id);
  }
}
