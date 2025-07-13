
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SocilMedia } from '../common/dtos/social-media.dto';

// Type cho các trường người tạo, cập nhật, xóa
class UserRef {
  @Prop()
  userId: number;

  @Prop()
  email: string;
}

@Schema({ timestamps: true })
export class Company {
  
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: false })
  primaryIndustry: string;

  @Prop({ required: false })
  size: string;

  @Prop({ required: false })
  foundedIn: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false })
  logo: string;
  
  @Prop({ required: false })
  socialMedias: SocilMedia[];

  @Prop({ type: UserRef, required: false })
  createdBy?: UserRef;

  @Prop({ type: UserRef, required: false })
  updatedBy?: UserRef;

  @Prop({ type: UserRef, required: false })
  deletedBy?: UserRef;

  @Prop({ default: false })
  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;
}

// Tạo kiểu Document
export type CompanyDocument = Company & Document;

// Tạo schema
export const CompanySchema = SchemaFactory.createForClass(Company);
