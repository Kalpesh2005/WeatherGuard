import { IsOptional, IsEnum } from 'class-validator';
import { UserStatus } from '../../users/enums/user-status.enum';

export class PendingUsersQueryDto {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
