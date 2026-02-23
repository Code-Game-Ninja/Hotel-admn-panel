import mongoose, { Schema, Document, models } from "mongoose";

export interface ISpaTreatment extends Document {
    title: string;
    description: string;
    duration: string;
    price: number;
    isActive: boolean;
}

const SpaTreatmentSchema = new Schema<ISpaTreatment>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String, required: true },
        price: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default models.SpaTreatment || mongoose.model<ISpaTreatment>("SpaTreatment", SpaTreatmentSchema);
