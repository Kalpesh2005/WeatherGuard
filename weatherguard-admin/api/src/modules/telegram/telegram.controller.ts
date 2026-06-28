import { Controller, Post, Body, Headers, UnauthorizedException, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(
    private telegramService: TelegramService,
    private configService: ConfigService,
  ) {}

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('x-telegram-bot-api-secret-token') secretHeader: string,
    @Body() update: any,
  ) {
    // Telegram sends the secret_token back as the X-Telegram-Bot-Api-Secret-Token header.
    const expectedSecret = this.configService.get<string>('telegramWebhookSecret');
    if (secretHeader !== expectedSecret) {
      throw new UnauthorizedException('Invalid secret');
    }

    try {
      if (update.message && update.message.text) {
        const text: string = update.message.text;
        const chatId = update.message.chat.id.toString();

        if (text.startsWith('/start ')) {
          const token = text.replace('/start ', '').trim();
          const user = await this.telegramService.linkChat(token, chatId);
          if (user) {
            await this.telegramService.sendApprovalNotice(chatId);
          } else {
            await this.telegramService.sendMessage(chatId, 'That link is invalid or expired.');
          }
        } else if (text === '/start') {
          // /start without a token — user opened bot directly
          await this.telegramService.sendMessage(chatId, 'Welcome! Please use the link provided by the WeatherGuard admin to link your account.');
        }
      }
    } catch (error) {
      console.error('Error handling Telegram webhook', error);
      // ALWAYS return HTTP 200 so Telegram doesn't aggressively retry
    }

    return 'OK';
  }
}
