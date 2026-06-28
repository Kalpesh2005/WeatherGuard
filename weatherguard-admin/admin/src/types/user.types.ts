export type UserRole = 'user' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string; // The backend returns id because we mapped it in toPublicProfile
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  hasTelegramLinked: boolean;
  telegramLinkUrl?: string;
  createdAt: string;
}

export interface ApproveUserResponse extends User {
  telegramLinkUrl: string;
}
