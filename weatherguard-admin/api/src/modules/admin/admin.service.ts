import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/enums/user-status.enum';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Model } from 'mongoose';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private telegramService: TelegramService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async listUsers(
    status: UserStatus = UserStatus.PENDING,
  ): Promise<UserResponseDto[]> {
    const query = status ? { status } : {};
    const users = await this.userModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
    return users.map((user) => this.usersService.toPublicProfile(user));
  }

  // This is the single write that makes a user eligible for alerts later
  // (Phase 5's alert query will filter on status: 'approved')
  async approveUser(userId: string, adminId: string): Promise<UserResponseDto & { telegramLinkUrl: string }> {
    const updatedUser = await this.usersService.updateStatus(userId, UserStatus.APPROVED, adminId);
    const token = await this.telegramService.generateLinkToken(userId);
    const telegramLinkUrl = this.telegramService.getLinkUrl(token);
    
    return {
      ...this.usersService.toPublicProfile(updatedUser),
      telegramLinkUrl,
    };
  }

  async rejectUser(userId: string): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.updateStatus(
      userId,
      UserStatus.REJECTED,
    );
    return this.usersService.toPublicProfile(updatedUser);
  }
}
