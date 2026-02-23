import mongoose, { Schema, Document, models } from "mongoose";

export interface IOffer extends Document {
    title: string;
    description: string;
    validUntil: Date;
    code: string;
    discount: string;
    image: string;
    isActive: boolean;
}

const OfferSchema = new Schema<IOffer>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        validUntil: { type: Date, required: true },
        code: { type: String, required: true, unique: true },
        discount: { type: String, required: true },
        image: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
