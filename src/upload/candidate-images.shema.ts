// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CandidateImage {

  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;
  
  @Prop({ required: true })
  filename: string;
}

// Tạo kiểu Document
export type CandidateImageDocument = CandidateImage & Document;

// Tạo schema
export const CandidateImageSchema = SchemaFactory.createForClass(CandidateImage);
