import { UserRole } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  sessionId: string;
  type: 'access';
}

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    role: UserRole;
  };
}

export interface SessionDto {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
  current: boolean;
}
