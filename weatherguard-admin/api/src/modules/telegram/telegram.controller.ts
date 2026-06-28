import { Controller, Post, Get, Body, Headers, Query, UnauthorizedException, HttpCode } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(
    private telegramService: TelegramService,
    private configService: ConfigService,
  ) {}

  @Get('setup-webhook')
  async setupWebhook(@Query('url') url: string) {
    if (!url) {
      return { error: 'Please provide your ngrok url, e.g., ?url=https://yourapp.ngrok.app' };
    }
    const secret = this.configService.get<string>('telegramWebhookSecret');
    const token = this.configService.get<string>('telegramBotToken');
    const webhookUrl = `${url.replace(/\/$/, '')}/telegram/webhook`;
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          secret_token: secret,
        }),
      });
      const data = await response.json();
      return { success: true, webhookUrl, telegramResponse: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

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
