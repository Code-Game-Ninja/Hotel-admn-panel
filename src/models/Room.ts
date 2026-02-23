import mongoose, { Schema, Document, models } from "mongoose";

export interface IRoom extends Document {
    slug: string;
    name: string;
    shortDesc: string;
    description: string;
    price: number;
    size: number;
    occupancy: number;
    bedType: string;
    amenities: string[];
    coverImage: string;
    images: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
    {
        slug: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        shortDesc: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: Number, required: true },
        occupancy: { type: Number, required: true, default: 2 },
        bedType: { type: String, required: true },
        amenities: [{ type: String }],
        coverImage: { type: String, required: true },
        images: [{ type: String }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default models.Room || mongoose.model<IRoom>("Room", RoomSchema);
