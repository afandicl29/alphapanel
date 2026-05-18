import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PhpService } from './php.service';

@ApiTags('PHP')
@ApiBearerAuth()
@Controller('php')
export class PhpController {
  constructor(private php: PhpService) {}

  @Get('versions')
  versions() {
    return this.php.listVersions();
  }

  @Post('selector')
  selector(@Body() body: { hostingAccountId: string; version: string }) {
    return this.php.setSelector(body.hostingAccountId, body.version);
  }

  @Post('extensions')
  extensions(@Body() body: { version: string; extension: string; enabled: boolean }) {
    return this.php.manageExtension(body.version, body.extension, body.enabled);
  }
}
