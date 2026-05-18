import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';

@ApiTags('Monitoring')
@ApiBearerAuth()
@Controller('monitoring')
export class MonitoringController {
  constructor(private monitoring: MonitoringService) {}

  @Get('logs')
  logs(@Query('service') service?: string, @Query('lines') lines?: string) {
    return this.monitoring.logs(service, parseInt(lines ?? '200', 10));
  }

  @Get('processes')
  processes() {
    return this.monitoring.processes();
  }

  @Get('services')
  services() {
    return this.monitoring.services();
  }

  @Get('cron')
  cron() {
    return this.monitoring.cronJobs();
  }

  @Post('cron')
  createCron(@Body() body: { name: string; command: string; schedule: string; hostingAccountId?: string }) {
    return this.monitoring.createCron(body);
  }
}
