import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserStatus } from './enums/user-status.enum';
import { UserResponseDto } from './dto/user-response.dto';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async findByProviderId(
    provider: string,
    providerId: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ provider, providerId }).exec();
  }

  async createFromOAuth(data: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.userModel(data);
    return createdUser.save();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Request Access: explicit user intent. Status starts as pending anyway.
  async requestAccess(userId: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.status === UserStatus.APPROVED) {
      throw new BadRequestException('Already approved');
    }
    if (user.status === UserStatus.REJECTED) {
      user.status = UserStatus.PENDING;
      return user.save();
    }
    return user; // already pending
  }

  toPublicProfile(user: UserDocument): UserResponseDto {
    const username = this.configService.get<string>('telegramBotUsername');
    const telegramLinkUrl = user.telegramLinkToken
      ? `https://t.me/${username}?start=${user.telegramLinkToken}`
      : undefined;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      status: user.status,
      hasTelegramLinked: !!user.telegramChatId,
      telegramLinkUrl,
      createdAt: (user as any).createdAt,
    };
  }

  async updateStatus(
    userId: string,
    status: UserStatus,
    approvedBy?: string,
  ): Promise<UserDocument> {
    const updateData: any = { status };
    if (status === UserStatus.APPROVED) {
      if (approvedBy) updateData.approvedBy = new Types.ObjectId(approvedBy);
      updateData.approvedAt = new Date();
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async setTelegramLinkToken(userId: string, token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { telegramLinkToken: token }).exec();
  }

  async findByTelegramLinkToken(token: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ telegramLinkToken: token }).exec();
  }

  async setTelegramChatId(userId: string, chatId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { telegramChatId: chatId },
      $unset: { telegramLinkToken: '' },
    }).exec();
  }

  // THIS query is the actual enforcement mechanism referenced in the README's data-flow section
  async findApprovedAndLinked(): Promise<UserDocument[]> {
    return this.userModel.find({
      status: UserStatus.APPROVED,
      telegramChatId: { $exists: true, $ne: null }
    }).exec();
  }
}
