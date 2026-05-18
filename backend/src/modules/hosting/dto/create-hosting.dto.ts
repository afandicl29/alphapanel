import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class CreateHostingDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-z0-9_-]+$/)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  domain: string;

  @ApiProperty()
  @IsString()
  packageId: string;

  @ApiPropertyOptional({ default: '8.3' })
  @IsString()
  phpVersion?: string;
}
