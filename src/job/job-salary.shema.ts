import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // Rất quan trọng: KHÔNG tạo _id cho từng item trong mảng
export class SalaryTemplate {
    @Prop()
    min: number;

    @Prop()
    max: number;

    @Prop()
    currency: string; // 'VND' | 'USD';

    @Prop()
    unit: string; // 'month' | 'year' | 'hour';

    @Prop()
    negotiable: boolean;
}

export const SalaryTemplateShema = SchemaFactory.createForClass(SalaryTemplate);
