import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Notification {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  createdAt: Date;
}

// Kiểu Document
export type NotificationDocument = Notification & Document;

// Schema
export const NotificationSchema = SchemaFactory.createForClass(Notification);
