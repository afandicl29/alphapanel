import { Global, Module } from '@nestjs/common';
import { DaemonClientService } from './daemon-client.service';

@Global()
@Module({
  providers: [DaemonClientService],
  exports: [DaemonClientService],
})
export class DaemonModule {}
