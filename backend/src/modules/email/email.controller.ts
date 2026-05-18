import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailService } from './email.service';

@ApiTags('Email')
@ApiBearerAuth()
@Controller('email')
export class EmailController {
  constructor(private email: EmailService) {}

  @Get()
  list(@Query('hostingAccountId') hostingAccountId: string) {
    return this.email.list(hostingAccountId);
  }

  @Post()
  create(@Body() body: { hostingAccountId: string; address: string; password: string; quotaMb?: number }) {
    return this.email.create(body.hostingAccountId, body.address, body.password, body.quotaMb);
  }

  @Post('dns')
  configureDns(@Body() body: { domain: string }) {
    return this.email.configureDns(body.domain);
  }
}
