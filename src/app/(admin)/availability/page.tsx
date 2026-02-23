"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Users, Calendar } from "lucide-react";

interface RoomStatus {
    roomId: string;
    roomName: string;
    available: boolean;
    guestName?: string;
    status?: string;
}

interface CalendarDay {
    date: string;
    rooms: RoomStatus[];
}

interface RoomInfo {
    _id: string;
    name: string;
}

export default function AvailabilityPage() {
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [calendar, setCalendar] = useState<Record<string, CalendarDay>>({});
    const [rooms, setRooms] = useState<RoomInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/rooms/availability?month=${month}`)
            .then((r) => r.json())
            .then((data) => {
                setCalendar(data.calendar || {});
                setRooms(data.rooms || []);
                setLoading(false);
            });
    }, [month]);

    const [year, m] = month.split("-").map(Number);
    const monthName = new Date(year, m - 1).toLocaleString("default", { month: "long", year: "numeric" });
    const daysInMonth = new Date(year, m, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    function prevMonth() {
        const d = new Date(year, m - 2, 1);
        setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    function nextMonth() {
        const d = new Date(year, m, 1);
        setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const today = new Date().toISOString().split("T")[0];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Room Availability</h1>
                    <p className="text-slate-400 mt-1">View room occupancy by date.</p>
                </div>
                <div className="flex items-center gap-1">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 mr-4">
                        <span className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/40 inline-block" /> Available
                        <span className="w-3 h-3 bg-red-500/20 border border-red-500/40 inline-block ml-2" /> Occupied
                    </span>
                </div>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-6 bg-slate-900 border border-slate-800 p-4">
                <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    {monthName}
                </h2>
                <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {loading ? (
                <div className="p-16 text-center text-slate-500">Loading availability...</div>
            ) : rooms.length === 0 ? (
                <div className="p-16 text-center text-slate-500">No active rooms found.</div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3 text-left text-[0.6rem] uppercase tracking-widest text-slate-500 min-w-[140px]">
                                    Room
                                </th>
                                {days.map((d) => {
                                    const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                                    const isToday = dateStr === today;
                                    const dayName = new Date(year, m - 1, d).toLocaleString("default", { weekday: "narrow" });
                                    return (
                                        <th
                                            key={d}
                                            className={`px-1 py-3 text-center min-w-[36px] ${isToday ? "bg-amber-500/10" : ""}`}
                                        >
                                            <div className={`text-[0.5rem] uppercase ${isToday ? "text-amber-400" : "text-slate-600"}`}>{dayName}</div>
                                            <div className={`text-sm font-semibold ${isToday ? "text-amber-400" : "text-slate-400"}`}>{d}</div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room._id} className="border-b border-slate-800/50">
                                    <td className="sticky left-0 z-10 bg-slate-900 px-4 py-2 text-white font-medium text-sm whitespace-nowrap border-r border-slate-800">
                                        {room.name}
                                    </td>
                                    {days.map((d) => {
                                        const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                                        const dayData = calendar[dateStr];
                                        const roomData = dayData?.rooms.find((r) => r.roomId === room._id);
                                        const isToday = dateStr === today;
                                        const isAvailable = roomData?.available !== false;

                                        return (
                                            <td
                                                key={d}
                                                className={`px-1 py-2 text-center ${isToday ? "bg-amber-500/5" : ""}`}
                                                title={
                                                    isAvailable
                                                        ? "Available"
                                                        : `Occupied by ${roomData?.guestName || "Guest"} (${roomData?.status})`
                                                }
                                            >
                                                <div
                                                    className={`w-6 h-6 mx-auto flex items-center justify-center rounded-sm transition-colors ${isAvailable
                                                            ? "bg-emerald-500/15 border border-emerald-500/30"
                                                            : "bg-red-500/20 border border-red-500/40"
                                                        }`}
                                                >
                                                    {!isAvailable && (
                                                        <Users className="w-3 h-3 text-red-400" />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Summary */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {rooms.map((room) => {
                    const occupiedDays = days.filter((d) => {
                        const dateStr = `${year}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                        const dayData = calendar[dateStr];
                        const roomData = dayData?.rooms.find((r) => r.roomId === room._id);
                        return roomData && !roomData.available;
                    }).length;
                    const occupancyRate = Math.round((occupiedDays / daysInMonth) * 100);

                    return (
                        <div key={room._id} className="bg-slate-900 border border-slate-800 p-4">
                            <p className="text-white font-medium text-sm mb-1">{room.name}</p>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 text-xs">{occupiedDays}/{daysInMonth} days booked</span>
                                <span className={`text-sm font-bold ${occupancyRate > 70 ? "text-red-400" : occupancyRate > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                                    {occupancyRate}%
                                </span>
                            </div>
                            <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${occupancyRate > 70 ? "bg-red-500" : occupancyRate > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                                    style={{ width: `${occupancyRate}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
