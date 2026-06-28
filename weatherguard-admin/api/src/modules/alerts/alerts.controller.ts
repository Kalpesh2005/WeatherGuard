import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  /** Dev-only: GET /alerts/trigger - no auth needed, easy to test in browser */
  @Get('trigger')
  async triggerNowDev() {
    const result = await this.alertsService.dispatchAlertsNow();
    return { message: `Alert dispatch complete`, ...result };
  }

  /** Production: POST /alerts/trigger - admin only */
  @Post('trigger')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async triggerNow() {
    const result = await this.alertsService.dispatchAlertsNow();
    return { message: `Alert dispatch complete`, ...result };
  }
}
