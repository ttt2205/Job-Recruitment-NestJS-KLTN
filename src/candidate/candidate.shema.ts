
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, Document } from 'mongoose';
import { SocilMedia } from 'src/common/dtos/social-media.dto';

// Type cho các trường người tạo, cập nhật, xóa
class UserRef {
  @Prop()
  userId: number;

  @Prop()
  email: string;
}

@Schema({ timestamps: true })
export class Candidate {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;
  
  @Prop({ required: true })
  name: string;

  @Prop({ type: Date, required: false })
  age?: Date;

  @Prop({ required: false })
  skills?: string[];

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  designation?: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  hourlyRate?: number;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  experience?: string;

  @Prop({ required: false })
  currentSalary?: string;

  @Prop({ required: false })
  expectSalary?: string;

  @Prop({ required: false })
  gender?: string;

  @Prop({ required: false })
  language?: string[];

  @Prop({ required: false })
  educationLevel?: string;
  
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
}

// Tạo kiểu Document
export type CandidateDocument = Candidate & Document;

// Tạo schema
export const CandidateSchema = SchemaFactory.createForClass(Candidate);
