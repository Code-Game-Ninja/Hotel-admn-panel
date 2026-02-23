import mongoose, { Schema, Document, models } from "mongoose";

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface IReservation extends Document {
    guestName: string;
    email: string;
    phone: string;
    roomId: mongoose.Types.ObjectId;
    roomName: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    specialRequests: string;
    status: ReservationStatus;
    totalPrice: number;
    createdAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
    {
        guestName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
        roomName: { type: String, required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        guests: { type: Number, required: true, default: 2 },
        specialRequests: { type: String, default: "" },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

export default models.Reservation || mongoose.model<IReservation>("Reservation", ReservationSchema);
