import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserResponseDto {
  id!: string;
  name!: string;
  email!: string;
  avatarUrl?: string;
  role!: UserRole;
  status!: UserStatus;
  hasTelegramLinked!: boolean;
  telegramLinkUrl?: string;
  createdAt!: Date;
}
