import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SslService } from './ssl.service';

@ApiTags('SSL')
@ApiBearerAuth()
@Controller('ssl')
export class SslController {
  constructor(private ssl: SslService) {}

  @Get()
  list() {
    return this.ssl.list();
  }

  @Post('letsencrypt')
  letsEncrypt(@Body() body: { domainName: string; hostingAccountId?: string }) {
    return this.ssl.issueLetsEncrypt(body.domainName, body.hostingAccountId);
  }

  @Post('upload')
  upload(@Body() body: { domainName: string; certificate: string; privateKey: string; chain?: string }) {
    return this.ssl.uploadManual(body.domainName, body.certificate, body.privateKey, body.chain);
  }
}
