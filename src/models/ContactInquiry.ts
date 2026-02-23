import mongoose, { Schema, Document, models } from "mongoose";

export interface IContactInquiry extends Document {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default models.ContactInquiry || mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);
