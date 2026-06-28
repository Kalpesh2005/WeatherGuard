import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import { AlertLog, AlertLogDocument } from './schemas/alert-log.schema';
import { WeatherService } from '../weather/weather.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private usersService: UsersService,
    private weatherService: WeatherService,
    private telegramService: TelegramService,
    @InjectModel(AlertLog.name) private alertLogModel: Model<AlertLogDocument>,
  ) {}

  async getEligibleUsers(): Promise<UserDocument[]> {
    return this.usersService.findApprovedAndLinked();
  }

  async createLog(userId: string, message: string, weatherSnapshot: Record<string, any>): Promise<AlertLogDocument> {
    const newLog = new this.alertLogModel({
      userId,
      message,
      weatherSnapshot,
      status: 'queued',
    });
    return newLog.save();
  }

  async markSent(logId: string): Promise<void> {
    await this.alertLogModel.findByIdAndUpdate(logId, {
      status: 'sent',
      sentAt: new Date(),
    }).exec();
  }

  async markFailed(logId: string, reason: string): Promise<void> {
    await this.alertLogModel.findByIdAndUpdate(logId, {
      status: 'failed',
      failureReason: reason,
    }).exec();
  }

  /** Direct (no-queue) alert dispatch — works without Redis, good for dev/manual trigger */
  async dispatchAlertsNow(): Promise<{ sent: number; failed: number }> {
    const users = await this.usersService.findApprovedAndLinked();
    this.logger.log(`dispatchAlertsNow: found ${users.length} eligible users`);
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const data = await this.weatherService.getCurrentConditions(18.5204, 73.8567);
        const message = this.weatherService.formatAlertMessage(data);
        const log = await this.createLog(user._id.toString(), message, data as any);
        const ok = await this.telegramService.sendMessage(user.telegramChatId!, message);
        if (ok) {
          await this.markSent(log._id.toString());
          sent++;
          this.logger.log(`Alert sent to user ${user._id}`);
        } else {
          await this.markFailed(log._id.toString(), 'telegram send failed');
          failed++;
        }
      } catch (err: any) {
        this.logger.error(`Failed alert for user ${user._id}`, err);
        failed++;
      }
    }

    return { sent, failed };
  }
}
