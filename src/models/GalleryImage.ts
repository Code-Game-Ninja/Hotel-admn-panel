import mongoose, { Schema, Document, models } from "mongoose";

export interface IGalleryImage extends Document {
    src: string;
    category: string;
    title: string;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
    {
        src: { type: String, required: true },
        category: { type: String, required: true },
        title: { type: String, required: true },
    },
    { timestamps: true }
);

export default models.GalleryImage || mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);
