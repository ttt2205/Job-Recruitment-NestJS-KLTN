import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // Rất quan trọng: KHÔNG tạo _id cho từng item trong mảng
export class JobWorkTime {
  @Prop({ required: false })
  from: string;

  @Prop({ required: false })
  to: string;
}

export const JobWorkTimeSchema = SchemaFactory.createForClass(JobWorkTime);
