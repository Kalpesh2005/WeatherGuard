import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ required: true, enum: ['google', 'github'] })
  provider!: string;

  @Prop({ required: true })
  providerId!: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.PENDING })
  status!: UserStatus;

  @Prop({ index: { unique: true, sparse: true } })
  telegramChatId?: string;

  @Prop()
  telegramLinkToken?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop()
  approvedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true });
