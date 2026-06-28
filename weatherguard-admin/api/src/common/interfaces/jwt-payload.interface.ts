import { UserRole } from '../../modules/users/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  role: UserRole;
}
