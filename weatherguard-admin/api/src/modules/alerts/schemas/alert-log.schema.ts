import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AlertLogDocument = AlertLog & Document;

@Schema({ timestamps: true })
export class AlertLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  message!: string;

  @Prop({ type: Object })
  weatherSnapshot?: Record<string, any>;

  @Prop({ type: String, enum: ['queued', 'sent', 'failed'], default: 'queued' })
  status!: string;

  @Prop()
  sentAt?: Date;

  @Prop()
  failureReason?: string;
}

export const AlertLogSchema = SchemaFactory.createForClass(AlertLog);

// Index userId and createdAt for querying a user's alert history later if needed
AlertLogSchema.index({ userId: 1, createdAt: -1 });
