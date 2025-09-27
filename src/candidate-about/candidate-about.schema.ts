
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CandidateAbout {

  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  organization: string;

  @Prop({ required: false })
  startTime: Date;

  @Prop({ required: false })
  endTime: Date;

  @Prop({ required: false })
  text?: string;

  createdAt: Date;

  updatedAt: Date;
}

// Tạo kiểu Document
export type CandidateAboutDocument = CandidateAbout & Document;

// Tạo schema
export const CandidateAboutSchema = SchemaFactory.createForClass(CandidateAbout);
