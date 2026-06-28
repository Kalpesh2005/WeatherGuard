import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Empty body, Passport handles the redirect to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const token = this.authService.issueToken(req.user);
    const frontendUrl = this.configService.get<string>('frontendUrl');
    // Using a query param redirect for MVP simplicity across domains (Vercel/Railway).
    // TODO: An httpOnly cookie would be more secure for production.
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }
}
