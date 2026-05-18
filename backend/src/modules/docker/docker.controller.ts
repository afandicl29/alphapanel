import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DockerService } from './docker.service';

@ApiTags('Docker')
@ApiBearerAuth()
@Controller('docker')
export class DockerController {
  constructor(private docker: DockerService) {}

  @Get()
  list() {
    return this.docker.list();
  }

  @Post()
  create(@Body() body: { name: string; image: string; ports?: Record<string, string>; hostingAccountId?: string }) {
    return this.docker.create(body.name, body.image, body.ports, body.hostingAccountId);
  }

  @Post(':id/restart')
  restart(@Param('id') id: string) {
    return this.docker.restart(id);
  }

  @Post('compose')
  compose(@Body() body: { name: string; composeFile: string }) {
    return this.docker.compose(body.composeFile, body.name);
  }
}
