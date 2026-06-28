import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { AlertsService } from './alerts.service';

@Injectable()
export class AlertsScheduler implements OnModuleInit {
  private readonly logger = new Logger(AlertsScheduler.name);

  constructor(
    private alertsService: AlertsService,
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const cronExpression = this.configService.get<string>('alertCronExpression') || '0 * * * *';

    const job = new CronJob(cronExpression, async () => {
      this.logger.log(`Cron trigger at ${new Date().toISOString()}`);
      const result = await this.alertsService.dispatchAlertsNow();
      this.logger.log(`Cron complete: ${result.sent} sent, ${result.failed} failed`);
    });

    this.schedulerRegistry.addCronJob('alertsCron', job);
    job.start();
    this.logger.log(`Alerts scheduler initialized with cron: ${cronExpression}`);
  }
}
