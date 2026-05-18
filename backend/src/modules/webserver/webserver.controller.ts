import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WebserverService } from './webserver.service';

@ApiTags('Web Server')
@ApiBearerAuth()
@Controller('webserver')
export class WebserverController {
  constructor(private ws: WebserverService) {}

  @Get('status')
  status() {
    return this.ws.status();
  }

  @Post('nginx')
  nginx(@Body() body: { hostingAccountId: string; config: string }) {
    return this.ws.setNginxConfig(body.hostingAccountId, body.config);
  }

  @Post('reverse-proxy')
  reverseProxy(@Body() body: { hostingAccountId: string; upstream: string; path?: string }) {
    return this.ws.setReverseProxy(body.hostingAccountId, body.upstream, body.path);
  }
}
