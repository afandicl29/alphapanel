import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Attaches client IP and user-agent for auth/session audit trails.
 * Applied globally via AuthModule configure().
 */
@Injectable()
export class AuthAuditMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      (typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : undefined) ??
      req.ip ??
      '0.0.0.0';
    req.authMeta = {
      ip,
      userAgent: req.headers['user-agent'],
    };
    next();
  }
}

declare global {
  namespace Express {
    interface Request {
      authMeta?: { ip: string; userAgent?: string };
    }
  }
}
