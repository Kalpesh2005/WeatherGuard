import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('githubClientId') as string,
      clientSecret: configService.get<string>('githubClientSecret') as string,
      callbackURL: configService.get<string>('githubCallbackUrl') as string,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    try {
      const { id, username, displayName, photos, emails } = profile;
      // GitHub's profile sometimes hides email behind a separate call.
      // If profile.emails is empty, fall back to a noreply email.
      const email =
        emails && emails.length > 0 && emails[0]?.value
          ? emails[0].value
          : `${username}@users.noreply.github.com`;

      const user = await this.authService.findOrCreateUser({
        providerId: String(id),
        email,
        name: displayName || username || 'GitHub User',
        avatarUrl: photos?.[0]?.value,
        provider: 'github',
      });
      done(null, user);
    } catch (err) {
      done(err, undefined);
    }
  }
}
