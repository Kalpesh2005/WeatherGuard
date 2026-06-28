import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import TelegramBot from 'node-telegram-bot-api';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: TelegramBot;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const token = this.configService.get<string>('telegramBotToken');
    // We operate purely in webhook mode, so we omit { polling: true }
    this.bot = new TelegramBot(token || '');
  }

  async generateLinkToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(16).toString('hex');
    await this.usersService.setTelegramLinkToken(userId, token);
    return token;
  }

  getLinkUrl(token: string): string {
    const username = this.configService.get<string>('telegramBotUsername');
    return `https://t.me/${username}?start=${token}`;
  }

  async linkChat(token: string, chatId: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByTelegramLinkToken(token);
    if (!user) return null;

    if (user.status !== 'approved') return null;

    await this.usersService.setTelegramChatId(user._id.toString(), chatId);
    return user;
  }

  async sendMessage(chatId: string, text: string): Promise<boolean> {
    try {
      await this.bot.sendMessage(chatId, text);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send message to ${chatId}:`, error);
      return false; // Returning boolean as requested for Phase 5 consistency
    }
  }

  async sendApprovalNotice(chatId: string): Promise<void> {
    await this.sendMessage(
      chatId,
      "✅ You're approved for WeatherGuard! You'll start receiving weather alerts here."
    );
  }
}
