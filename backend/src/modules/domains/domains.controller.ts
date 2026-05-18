import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { DomainsService } from './domains.service';

@ApiTags('Domains')
@ApiBearerAuth()
@Controller('domains')
export class DomainsController {
  constructor(private domains: DomainsService) {}

  @Get()
  list(@Req() req: Request & { user: { id: string } }) {
    return this.domains.findByUser(req.user.id);
  }

  @Post()
  create(@Body() body: { name: string; hostingAccountId?: string }, @Req() req: Request & { user: { id: string } }) {
    return this.domains.create(req.user.id, body.name, body.hostingAccountId);
  }

  @Post(':id/subdomains')
  addSubdomain(@Param('id') id: string, @Body() body: { name: string; documentRoot?: string }) {
    return this.domains.addSubdomain(id, body.name, body.documentRoot);
  }

  @Put(':id/dns')
  updateDns(@Param('id') id: string, @Body() body: { records: { type: string; name: string; content: string; ttl?: number }[] }) {
    return this.domains.updateDns(id, body.records);
  }

  @Post(':id/redirects')
  addRedirect(@Param('id') id: string, @Body() body: { sourcePath: string; targetUrl: string; statusCode?: number }) {
    return this.domains.addRedirect(id, body.sourcePath, body.targetUrl, body.statusCode);
  }
}
