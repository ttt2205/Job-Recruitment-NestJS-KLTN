// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SocilMedia } from 'src/common/dtos/social-media.dto';

@Schema({ timestamps: true })
export class Application {
  _id: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  })
  candidateId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true })
  jobId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true })
  resumeId: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date;
}

// Tạo kiểu Document
export type ApplicationDocument = Application & Document;

// Tạo schema
export const ApplicationSchema = SchemaFactory.createForClass(Application);
