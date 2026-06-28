import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserStatus } from '../users/enums/user-status.enum';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async findOrCreateUser(profileData: Partial<User>): Promise<UserDocument> {
    let user = await this.usersService.findByProviderId(
      profileData.provider!,
      profileData.providerId!,
    );
    if (!user) {
      try {
        user = await this.usersService.createFromOAuth({
          ...profileData,
          status: UserStatus.PENDING,
          role: UserRole.USER,
        });
      } catch (err: any) {
        // MongoDB duplicate key error (E11000) — user already exists,
        // likely from a concurrent request or a previous login with same email.
        // Retry the lookup so we return the existing document instead of crashing.
        if (err?.code === 11000) {
          const existing = await this.usersService.findByProviderId(
            profileData.provider!,
            profileData.providerId!,
          );
          if (existing) return existing;
        }
        throw err;
      }
    }
    return user;
  }

  issueToken(user: UserDocument): string {
    const payload = { sub: user._id.toString(), role: user.role };
    return this.jwtService.sign(payload);
  }
}
