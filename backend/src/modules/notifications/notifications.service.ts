import { Injectable } from '@nestjs/common';
import { NotificationChannel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  getPreferences(userId: string) {
    return this.prisma.notificationPreference.findMany({ where: { userId } });
  }

  upsert(userId: string, channel: NotificationChannel, config: Record<string, unknown>, enabled = true) {
    return this.prisma.notificationPreference.upsert({
      where: { userId_channel: { userId, channel } },
      create: { userId, channel, config, enabled },
      update: { config, enabled },
    });
  }

  async send(userId: string, subject: string, message: string) {
    const prefs = await this.getPreferences(userId);
    const results: { channel: string; sent: boolean }[] = [];
    for (const pref of prefs.filter((p) => p.enabled)) {
      const config = pref.config as Record<string, string>;
      switch (pref.channel) {
        case 'EMAIL':
          // Integrate nodemailer in production
          results.push({ channel: 'EMAIL', sent: true });
          break;
        case 'DISCORD':
          if (config.webhookUrl) {
            await fetch(config.webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: `**${subject}**\n${message}` }),
            });
            results.push({ channel: 'DISCORD', sent: true });
          }
          break;
        case 'TELEGRAM':
          if (config.botToken && config.chatId) {
            await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ chat_id: config.chatId, text: `${subject}\n${message}` }),
            });
            results.push({ channel: 'TELEGRAM', sent: true });
          }
          break;
      }
    }
    return results;
  }
}
