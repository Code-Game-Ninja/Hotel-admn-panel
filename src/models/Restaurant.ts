import mongoose, { Schema, Document, models } from "mongoose";

export interface IRestaurant extends Document {
    name: string;
    cuisine: string;
    description: string;
    hours: string;
    dressCode: string;
    image: string;
    isActive: boolean;
}

const RestaurantSchema = new Schema<IRestaurant>(
    {
        name: { type: String, required: true },
        cuisine: { type: String, required: true },
        description: { type: String, required: true },
        hours: { type: String, required: true },
        dressCode: { type: String, required: true },
        image: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default models.Restaurant || mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
