import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private files: FilesService) {}

  @Get()
  list(@Query('path') path: string, @Query('username') username: string) {
    return this.files.list(path, username);
  }

  @Post('chmod')
  chmod(@Body() body: { path: string; mode: string; username: string }) {
    return this.files.chmod(body.path, body.mode, body.username);
  }

  @Post('extract')
  extract(@Body() body: { path: string; username: string }) {
    return this.files.extractZip(body.path, body.username);
  }
}
