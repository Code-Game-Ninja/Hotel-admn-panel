import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Room from "@/models/Room";

// GET /api/rooms/availability?checkIn=2025-01-01&checkOut=2025-01-03
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");
        const month = searchParams.get("month"); // YYYY-MM format for calendar view

        if (month) {
            // Calendar view: return all reservations for a given month
            const [year, m] = month.split("-").map(Number);
            const startOfMonth = new Date(year, m - 1, 1);
            const endOfMonth = new Date(year, m, 0, 23, 59, 59);

            const [rooms, reservations] = await Promise.all([
                Room.find({ isActive: true }).select("name slug coverImage price"),
                Reservation.find({
                    status: { $ne: "cancelled" },
                    checkIn: { $lte: endOfMonth },
                    checkOut: { $gte: startOfMonth },
                }).select("roomId roomName checkIn checkOut guestName status"),
            ]);

            // Build availability map: for each day, which rooms are occupied
            const daysInMonth = endOfMonth.getDate();
            const calendar: Record<string, { date: string; rooms: { roomId: string; roomName: string; available: boolean; guestName?: string; status?: string }[] }> = {};

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const dateObj = new Date(year, m - 1, d);

                calendar[dateStr] = {
                    date: dateStr,
                    rooms: rooms.map((room) => {
                        const booking = reservations.find(
                            (r) => r.roomId.toString() === room._id.toString() &&
                                new Date(r.checkIn) <= dateObj &&
                                new Date(r.checkOut) > dateObj
                        );
                        return {
                            roomId: room._id.toString(),
                            roomName: room.name,
                            available: !booking,
                            guestName: booking?.guestName,
                            status: booking?.status,
                        };
                    }),
                };
            }

            return NextResponse.json({ rooms, calendar, month });
        }

        if (checkIn && checkOut) {
            // Availability check for specific dates
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            const [rooms, reservations] = await Promise.all([
                Room.find({ isActive: true }),
                Reservation.find({
                    status: { $ne: "cancelled" },
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gt: checkInDate },
                }).select("roomId checkOut"),
            ]);

            const availability = rooms.map((room) => {
                const blockingReservation = reservations.find(
                    (r) => r.roomId.toString() === room._id.toString()
                );
                const isAvailable = !blockingReservation;

                return {
                    ...room.toObject(),
                    available: isAvailable,
                    // If booked, tell client when this room becomes free
                    availableAfter: blockingReservation
                        ? blockingReservation.checkOut.toISOString().split("T")[0]
                        : null,
                };
            });

            return NextResponse.json(availability);
        }

        return NextResponse.json({ error: "Provide 'month' (YYYY-MM) or 'checkIn' & 'checkOut'" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
