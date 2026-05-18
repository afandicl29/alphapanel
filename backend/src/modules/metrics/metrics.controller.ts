import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('Metrics')
@ApiBearerAuth()
@Controller('metrics')
export class MetricsController {
  constructor(private metrics: MetricsService) {}

  @Get('live')
  getLive() {
    return this.metrics.getLiveMetrics();
  }

  @Get('history')
  getHistory(@Query('hours') hours?: string) {
    return this.metrics.getHistory(parseInt(hours ?? '24', 10));
  }
}
