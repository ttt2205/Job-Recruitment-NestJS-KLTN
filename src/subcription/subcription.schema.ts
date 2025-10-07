import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subscription {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServicePackage',
    required: true,
  })
  packageId: mongoose.Types.ObjectId;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'EXPIRED'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'EXPIRED';

  createdAt: Date;
  updatedAt: Date;
}

// Kiểu Document
export type SubscriptionDocument = Subscription & Document;

// Schema
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
