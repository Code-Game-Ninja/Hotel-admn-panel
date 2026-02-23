import mongoose, { Schema, Document, models } from "mongoose";

export interface IExperience extends Document {
    title: string;
    category: string;
    duration: string;
    description: string;
    image: string;
    isActive: boolean;
}

const ExperienceSchema = new Schema<IExperience>(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema);
