import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('googleClientId') as string,
      clientSecret: configService.get<string>('googleClientSecret') as string,
      callbackURL: configService.get<string>('googleCallbackUrl') as string,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, displayName, photos } = profile;
      const user = await this.authService.findOrCreateUser({
        providerId: String(id),
        email: emails[0].value,
        name: displayName || 'Google User',
        avatarUrl: photos?.[0]?.value,
        provider: 'google',
      });
      done(null, user);
    } catch (err) {
      done(err as Error, undefined);
    }
  }
}
