import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { PendingUsersQueryDto } from './dto/pending-users-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserStatus } from '../users/enums/user-status.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getUsers(@Query() query: PendingUsersQueryDto) {
    const status = query.status || UserStatus.PENDING;
    return this.adminService.listUsers(status);
  }

  @Post('users/:id/approve')
  async approveUser(@Param('id') userId: string, @CurrentUser() admin: any) {
    return this.adminService.approveUser(userId, admin.userId);
  }

  @Post('users/:id/reject')
  async rejectUser(@Param('id') userId: string) {
    return this.adminService.rejectUser(userId);
  }
}
