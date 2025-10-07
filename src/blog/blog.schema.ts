import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Blog {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  authorId: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  content: string;

  createdAt: Date;
  updatedAt: Date;
}

// Kiểu Document
export type BlogDocument = Blog & Document;

// Schema
export const BlogSchema = SchemaFactory.createForClass(Blog);
