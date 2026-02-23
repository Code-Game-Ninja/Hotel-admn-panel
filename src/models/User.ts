import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: "admin" | "staff";
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["admin", "staff"], default: "staff" },
    },
    { timestamps: true }
);

export default models.User || mongoose.model<IUser>("User", UserSchema);
