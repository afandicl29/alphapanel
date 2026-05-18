import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'crypto';
import { AccessTokenPayload } from './auth.types';
import { UserRole } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  generateRefreshToken(): string {
    return randomBytes(48).toString('base64url');
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  signAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
    return this.jwt.sign({ ...payload, type: 'access' });
  }

  getAccessExpiresIn(): string {
    return this.config.get('JWT_EXPIRES_IN', '15m');
  }

  getRefreshExpiresMs(): number {
    const raw = this.config.get('JWT_REFRESH_EXPIRES_IN', '7d');
    const match = /^(\d+)([dhms])$/.exec(raw);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const n = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      d: 86400000,
      h: 3600000,
      m: 60000,
      s: 1000,
    };
    return n * (multipliers[unit] ?? 86400000);
  }

  buildAuthUserSummary(user: {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    role: UserRole;
  }) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
  }
}
