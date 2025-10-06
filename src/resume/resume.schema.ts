import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Resume {
    _id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true })
    candidateId: mongoose.Types.ObjectId;

    @Prop({ required: false })
    fileName?: string;

    createdAt: Date;
}

export type ResumeDocument = Resume & Document;

export const ResumeSchema = SchemaFactory.createForClass(Resume);
