import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // ❗ Rất quan trọng: KHÔNG tạo _id cho từng item trong mảng
export class JobType {
  @Prop({ required: true })
  styleClass: string;

  @Prop({ required: true })
  type: string;
}

export const JobTypeSchema = SchemaFactory.createForClass(JobType);
