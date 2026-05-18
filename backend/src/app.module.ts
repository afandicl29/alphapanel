import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { HostingModule } from './modules/hosting/hosting.module';
import { DomainsModule } from './modules/domains/domains.module';
import { SslModule } from './modules/ssl/ssl.module';
import { FilesModule } from './modules/files/files.module';
import { DatabasesModule } from './modules/databases/databases.module';
import { EmailModule } from './modules/email/email.module';
import { WebserverModule } from './modules/webserver/webserver.module';
import { PhpModule } from './modules/php/php.module';
import { DockerModule } from './modules/docker/docker.module';
import { BackupsModule } from './modules/backups/backups.module';
import { SecurityModule } from './modules/security/security.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { TerminalModule } from './modules/terminal/terminal.module';
import { InstallersModule } from './modules/installers/installers.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { PackagesModule } from './modules/packages/packages.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { DaemonModule } from './daemon/daemon.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL ?? '60', 10) * 1000,
        limit: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
      },
    ]),
    PrismaModule,
    RedisModule,
    DaemonModule,
    AuthModule,
    UsersModule,
    MetricsModule,
    HostingModule,
    DomainsModule,
    SslModule,
    FilesModule,
    DatabasesModule,
    EmailModule,
    WebserverModule,
    PhpModule,
    DockerModule,
    BackupsModule,
    SecurityModule,
    MonitoringModule,
    TerminalModule,
    InstallersModule,
    NotificationsModule,
    AdminModule,
    PackagesModule,
    RealtimeModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
