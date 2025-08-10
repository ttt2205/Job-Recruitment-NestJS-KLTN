
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { JobType } from './dtos/job-type.dto';
import { JobTypeSchema } from './job-type.schema';
import { SalaryTemplate } from './job-salary.shema';
import { JobWorkTime } from './job-work-time.schema';

// Type cho các trường người tạo, cập nhật, xóa
class UserRef {
  @Prop()
  userId: number;

  @Prop()
  email: string;
}

@Schema({ timestamps: true })
export class Job {

  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true })
  companyId: mongoose.Types.ObjectId;

  @Prop({ required: false }) // Mảng kỹ năng tham chiếu
  skills?: string[];

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [JobTypeSchema], required: false })
  jobType?: JobType[]
  
  @Prop({ type: SalaryTemplate, required: false })
  salary?: SalaryTemplate;

  @Prop({ required: true })
  level: string;

  @Prop({ type: [String], required: true })
  responsibilities: string[];

  @Prop({ type: [String], required: true })
  skillAndExperience: string[];

  @Prop({ required: true })
  experience: number;

  @Prop({ type: JobWorkTime, required: false })
  workTime?: JobWorkTime;

  @Prop({ required: true })
  industry: string;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: Date ,required: true })
  expirationDate: Date;

  @Prop({ type: UserRef, required: false })
  createdBy?: UserRef;

  @Prop({ type: UserRef, required: false })
  updatedBy?: UserRef;

  @Prop({ type: UserRef, required: false })
  deletedBy?: UserRef;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

// Tạo kiểu Document
export type JobDocument = Job & Document;

// Tạo schema
export const JobSchema = SchemaFactory.createForClass(Job);
