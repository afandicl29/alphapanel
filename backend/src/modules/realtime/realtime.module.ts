import { Module } from '@nestjs/common';
import { MetricsModule } from '../metrics/metrics.module';
import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [MetricsModule],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}
