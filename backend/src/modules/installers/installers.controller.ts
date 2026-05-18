import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InstallersService } from './installers.service';

@ApiTags('One-Click Installers')
@ApiBearerAuth()
@Controller('installers')
export class InstallersController {
  constructor(private installers: InstallersService) {}

  @Get()
  list() {
    return this.installers.list();
  }

  @Post('install')
  install(@Body() body: { slug: string; hostingAccountId: string; domain: string }) {
    return this.installers.install(body.slug, body.hostingAccountId, body.domain);
  }
}
