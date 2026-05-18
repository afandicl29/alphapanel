import { Module } from '@nestjs/common';
import { WebserverController } from './webserver.controller';
import { WebserverService } from './webserver.service';

@Module({ controllers: [WebserverController], providers: [WebserverService] })
export class WebserverModule {}
