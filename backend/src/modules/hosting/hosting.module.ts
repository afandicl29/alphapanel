import { Module } from '@nestjs/common';
import { HostingController } from './hosting.controller';
import { HostingService } from './hosting.service';

@Module({
  controllers: [HostingController],
  providers: [HostingService],
  exports: [HostingService],
})
export class HostingModule {}
