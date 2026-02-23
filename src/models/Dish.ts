import mongoose, { Schema, Document, models } from "mongoose";

export interface IDish extends Document {
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    isSpicy: boolean;
    isPopular: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DishSchema = new Schema<IDish>(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
        isVeg: { type: Boolean, default: false },
        isSpicy: { type: Boolean, default: false },
        isPopular: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default models.Dish || mongoose.model<IDish>("Dish", DishSchema);
