import {
  Controller,
  Post,
  Get,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserResponseDto } from './dto/user-response.dto';
import type { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('request-access')
  @UseGuards(JwtAuthGuard)
  async requestAccess(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.requestAccess(user.sub);
    return this.usersService.toPublicProfile(updatedUser);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    const foundUser = await this.usersService.findById(user.sub);
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.toPublicProfile(foundUser);
  }
}
