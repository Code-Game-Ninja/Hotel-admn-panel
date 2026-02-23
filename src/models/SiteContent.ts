import mongoose, { Schema, Document, models } from "mongoose";

export interface ISiteContent extends Document {
    key: string;
    section: string;
    label: string;
    type: "text" | "textarea" | "image" | "url";
    value: string;
    updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
    {
        key: { type: String, required: true, unique: true },
        section: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, enum: ["text", "textarea", "image", "url"], default: "text" },
        value: { type: String, default: "" },
    },
    { timestamps: true }
);

export default models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
