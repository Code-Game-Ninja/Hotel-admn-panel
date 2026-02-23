import mongoose, { Schema, Document, models } from "mongoose";

export interface ISettings extends Document {
    restaurantName: string;
    tagline: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    openingHours: string;
    closingHours: string;
    daysOpen: string;
    socialLinks: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
    updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
    {
        restaurantName: { type: String, default: "Grand Horizon" },
        tagline: { type: String, default: "Fine Dining & Cocktails" },
        description: { type: String, default: "" },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        address: { type: String, default: "" },
        openingHours: { type: String, default: "12:00 PM" },
        closingHours: { type: String, default: "11:00 PM" },
        daysOpen: { type: String, default: "Monday - Sunday" },
        socialLinks: {
            instagram: { type: String, default: "" },
            facebook: { type: String, default: "" },
            twitter: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

export default models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
