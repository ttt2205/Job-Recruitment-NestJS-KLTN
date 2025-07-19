
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CandidateAbout {

  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  industry: string;

  @Prop({ required: true })
  time: string;

  @Prop({ required: false })
  text?: string;

  createdAt: Date;

  updatedAt: Date;
}

// Tạo kiểu Document
export type CandidateAboutDocument = CandidateAbout & Document;

// Tạo schema
export const CandidateAboutSchema = SchemaFactory.createForClass(CandidateAbout);
