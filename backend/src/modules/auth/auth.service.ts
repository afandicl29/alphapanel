import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenService } from './token.service';
import { AuthTokensResponse, SessionDto } from './auth.types';
import { isAdmin } from '../../common/constants/roles';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private tokens: TokenService,
  ) {}

  async login(dto: LoginDto, ip: string, userAgent?: string): Promise<AuthTokensResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    await this.prisma.loginHistory.create({
      data: { userId: user.id, ipAddress: ip, userAgent, success: valid },
    });
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    if (user.twoFactorEnabled) {
      if (!dto.totpCode) throw new BadRequestException('2FA code required');
      const ok = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'base32',
        token: dto.totpCode,
        window: 1,
      });
      if (!ok) throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), lastLoginIp: ip },
    });

    return this.createSession(user, ip, userAgent);
  }

  async register(
    dto: RegisterDto,
    ip: string,
    userAgent?: string,
    creatorRole?: UserRole,
  ): Promise<AuthTokensResponse> {
    const email = dto.email.toLowerCase();
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username: dto.username }] },
    });
    if (exists) throw new BadRequestException('Email or username already exists');

    const role = this.resolveRegisterRole(dto.role, creatorRole);

    const hash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        username: dto.username,
        passwordHash: hash,
        displayName: dto.displayName,
        role,
        parentId: dto.parentId,
        status: UserStatus.ACTIVE,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'auth.register',
        resource: 'user',
        resourceId: user.id,
        ipAddress: ip,
        metadata: { role: user.role },
      },
    });

    return this.createSession(user, ip, userAgent);
  }

  async refresh(dto: RefreshTokenDto, ip: string, userAgent?: string): Promise<AuthTokensResponse> {
    const hash = this.tokens.hashRefreshToken(dto.refreshToken);
    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash: hash },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired session');
    }
    if (session.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    await this.revokeSession(session.id);

    return this.createSession(session.user, ip, userAgent);
  }

  async logout(sessionId: string, userId: string): Promise<{ success: boolean }> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session not found');
    await this.revokeSession(session.id);
    return { success: true };
  }

  async logoutAll(userId: string, exceptSessionId?: string): Promise<{ revoked: number }> {
    const result = await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
      },
      data: { revokedAt: new Date() },
    });
    return { revoked: result.count };
  }

  async listSessions(userId: string, currentSessionId?: string): Promise<SessionDto[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { lastActiveAt: 'desc' },
    });
    return sessions.map((s) => ({
      id: s.id,
      userAgent: s.userAgent,
      ipAddress: s.ipAddress,
      expiresAt: s.expiresAt,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
      current: s.id === currentSessionId,
    }));
  }

  async revokeSessionById(sessionId: string, userId: string): Promise<{ success: boolean }> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });
    if (!session) throw new NotFoundException('Session not found');
    await this.revokeSession(session.id);
    return { success: true };
  }

  async validateSession(sessionId: string, userId: string): Promise<boolean> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    if (session) {
      await this.prisma.session.update({
        where: { id: sessionId },
        data: { lastActiveAt: new Date() },
      });
    }
    return !!session;
  }

  async profile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        status: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  private resolveRegisterRole(requested?: UserRole, creatorRole?: UserRole): UserRole {
    if (!requested || requested === UserRole.USER) {
      return UserRole.USER;
    }

    if (requested === UserRole.RESELLER) {
      if (creatorRole && isAdmin(creatorRole)) return UserRole.RESELLER;
      throw new ForbiddenException('Only admins can create reseller accounts');
    }

    if (requested === UserRole.ADMIN || requested === UserRole.SUPER_ADMIN) {
      if (creatorRole === UserRole.SUPER_ADMIN) return requested;
      throw new ForbiddenException('Only super admin can assign admin roles');
    }

    return UserRole.USER;
  }

  private async createSession(
    user: {
      id: string;
      email: string;
      username: string;
      displayName: string | null;
      role: UserRole;
    },
    ip: string,
    userAgent?: string,
  ): Promise<AuthTokensResponse> {
    const refreshToken = this.tokens.generateRefreshToken();
    const refreshTokenHash = this.tokens.hashRefreshToken(refreshToken);
    const expiresAt = new Date(Date.now() + this.tokens.getRefreshExpiresMs());

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt,
        ipAddress: ip,
        userAgent,
      },
    });

    const accessToken = this.tokens.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.tokens.getAccessExpiresIn(),
      user: this.tokens.buildAuthUserSummary(user),
    };
  }

  private async revokeSession(sessionId: string) {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}
