import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationChannel } from '@prisma/client';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  list(@Req() req: Request & { user: { id: string } }) {
    return this.notifications.getPreferences(req.user.id);
  }

  @Post('preferences')
  upsert(
    @Req() req: Request & { user: { id: string } },
    @Body() body: { channel: NotificationChannel; config: Record<string, unknown>; enabled?: boolean },
  ) {
    return this.notifications.upsert(req.user.id, body.channel, body.config, body.enabled);
  }

  @Post('test')
  test(@Req() req: Request & { user: { id: string } }) {
    return this.notifications.send(req.user.id, 'AlphaPanel Test', 'Notification test from AlphaPanel');
  }
}
