import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

function clientMeta(req: Request) {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ?? req.ip ?? '0.0.0.0';
  const userAgent = req.headers['user-agent'];
  return { ip, userAgent };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const { ip, userAgent } = clientMeta(req);
    return this.auth.login(dto, ip, userAgent);
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    const { ip, userAgent } = clientMeta(req);
    return this.auth.register(dto, ip, userAgent);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESELLER)
  @ApiBearerAuth()
  @Post('register/reseller')
  registerReseller(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
  ) {
    const { ip, userAgent } = clientMeta(req);
    return this.auth.register(
      { ...dto, role: dto.role ?? UserRole.USER, parentId: dto.parentId ?? user.id },
      ip,
      userAgent,
      user.role,
    );
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto, @Req() req: Request) {
    const { ip, userAgent } = clientMeta(req);
    return this.auth.refresh(dto, ip, userAgent);
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(@CurrentUser() user: AuthUser) {
    if (!user.sessionId) return { success: true };
    return this.auth.logout(user.sessionId, user.id);
  }

  @ApiBearerAuth()
  @Post('logout-all')
  logoutAll(@CurrentUser() user: AuthUser) {
    return this.auth.logoutAll(user.id, user.sessionId);
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.auth.profile(user.id);
  }

  @ApiBearerAuth()
  @Get('sessions')
  sessions(@CurrentUser() user: AuthUser) {
    return this.auth.listSessions(user.id, user.sessionId);
  }

  @ApiBearerAuth()
  @Delete('sessions/:id')
  revokeSession(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.auth.revokeSessionById(id, user.id);
  }
}
