import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { AlertsService } from '../alerts.service';
import { WeatherService } from '../../weather/weather.service';
import { TelegramService } from '../../telegram/telegram.service';
import { UsersService } from '../../users/users.service';

@Processor('alerts')
export class AlertProcessor extends WorkerHost {
  private readonly logger = new Logger(AlertProcessor.name);

  constructor(
    private usersService: UsersService,
    private alertsService: AlertsService,
    private weatherService: WeatherService,
    private telegramService: TelegramService,
    private configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<{ userId: string }>): Promise<void> {
    const { userId } = job.data;
    
    // Look up the user
    const user = await this.usersService.findById(userId);
    
    // Defense-in-depth: re-check status here since time may have passed between enqueue and processing
    if (!user || user.status !== 'approved' || !user.telegramChatId) {
      this.logger.warn(`Skipping alert for user ${userId} - not eligible (status: ${user?.status})`);
      return;
    }

    try {
      // In a real app, lat/long would come from the user's profile
      const lat = this.configService.get<number>('defaultLatitude') || 18.5204;
      const lon = this.configService.get<number>('defaultLongitude') || 73.8567;

      const data = await this.weatherService.getCurrentConditions(lat, lon);
      const message = this.weatherService.formatAlertMessage(data);

      const log = await this.alertsService.createLog(userId, message, data as any);

      const ok = await this.telegramService.sendMessage(user.telegramChatId, message);

      if (ok) {
        await this.alertsService.markSent(log._id.toString());
      } else {
        await this.alertsService.markFailed(log._id.toString(), 'telegram send failed');
      }
    } catch (error: any) {
      this.logger.error(`Error processing alert for user ${userId}`, error);
      // We don't have a log ID if createLog failed, but if it did, the job fails gracefully
      throw error; // Let BullMQ handle retries if desired
    }
  }
}
