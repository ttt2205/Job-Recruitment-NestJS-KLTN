// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SocilMedia } from 'src/common/dtos/social-media.dto';

@Schema({ timestamps: true })
export class ServicePackage {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  desciption: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  durationDay: number;

  @Prop({
    type: String,
    enum: ['CANDIDATE', 'EMPLOYER', 'ALL'],
    default: 'ALL',
  })
  status: 'CANDIDATE' | 'EMPLOYER' | 'ALL';

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

// Tạo kiểu Document
export type ServicePackageDocument = ServicePackage & Document;

// Tạo schema
export const ServicePackageSchema =
  SchemaFactory.createForClass(ServicePackage);
