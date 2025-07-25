// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// Type cho các trường người tạo, cập nhật, xóa
class UserRef {
  @Prop()
  userId: number;

  @Prop()
  email: string;
}

@Schema({ timestamps: true })
export class User {

  _id: mongoose.Types.ObjectId;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  type: string; // admin, company, candidate

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: UserRef, required: false })
  createdBy?: UserRef;

  @Prop({ type: UserRef, required: false })
  updatedBy?: UserRef;

  @Prop({ type: UserRef, required: false })
  deletedBy?: UserRef;

  @Prop({ default: false })
  isDeleted: boolean;
}

// Tạo kiểu Document
export type UserDocument = User & Document;

// Tạo schema
export const UserSchema = SchemaFactory.createForClass(User);
