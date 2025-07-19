
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CompanyImage {

  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true })
  companyId: mongoose.Types.ObjectId;
  
  @Prop({ required: true })
  url: string;
}

// Tạo kiểu Document
export type CompanyImageDocument = CompanyImage & Document;

// Tạo schema
export const CompanyImageSchema = SchemaFactory.createForClass(CompanyImage);