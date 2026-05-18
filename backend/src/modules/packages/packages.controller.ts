import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PackagesService } from './packages.service';

@ApiTags('Packages')
@ApiBearerAuth()
@Controller('packages')
export class PackagesController {
  constructor(private packages: PackagesService) {}

  @Get()
  list() {
    return this.packages.findAll();
  }

  @Post()
  create(@Body() body: Parameters<PackagesService['create']>[0]) {
    return this.packages.create(body);
  }
}
