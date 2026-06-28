import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlertsService } from './alerts.service';
import { AlertsScheduler } from './alerts.scheduler';
import { AlertsController } from './alerts.controller';
import { AlertLog, AlertLogSchema } from './schemas/alert-log.schema';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../telegram/telegram.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AlertLog.name, schema: AlertLogSchema }]),
    UsersModule,
    TelegramModule,
    WeatherModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsScheduler],
  exports: [AlertsService],
})
export class AlertsModule {}
