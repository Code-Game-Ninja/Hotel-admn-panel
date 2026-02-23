"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed, CalendarCheck, MessageSquare, Bed, Clock, TrendingUp } from "lucide-react";

interface Stats {
    menuItems: number;
    rooms: number;
    reservations: number;
    inquiries: number;
    recentReservations: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({ menuItems: 0, rooms: 0, reservations: 0, inquiries: 0, recentReservations: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/menu").then(r => r.json()),
            fetch("/api/rooms").then(r => r.json()),
            fetch("/api/reservations").then(r => r.json()),
            fetch("/api/contact").then(r => r.json()),
        ]).then(([menu, rooms, reservations, inquiries]) => {
            setStats({
                menuItems: Array.isArray(menu) ? menu.length : 0,
                rooms: Array.isArray(rooms) ? rooms.length : 0,
                reservations: Array.isArray(reservations) ? reservations.length : 0,
                inquiries: Array.isArray(inquiries) ? inquiries.filter((i: any) => !i.isRead).length : 0,
                recentReservations: Array.isArray(reservations) ? reservations.slice(0, 5) : [],
            });
            setLoading(false);
        });
    }, []);

    const statCards = [
        { label: "MENU ITEMS", value: stats.menuItems, icon: UtensilsCrossed, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "ROOMS", value: stats.rooms, icon: Bed, color: "text-violet-400", bg: "bg-violet-500/10" },
        { label: "RESERVATIONS", value: stats.reservations, icon: CalendarCheck, color: "text-amber-400", bg: "bg-amber-500/10" },
        { label: "UNREAD INQUIRIES", value: stats.inquiries, icon: MessageSquare, color: "text-sky-400", bg: "bg-sky-500/10" },
    ];

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">Welcome back. Here&apos;s your overview.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-slate-900 border border-slate-800 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[0.65rem] uppercase tracking-widest text-slate-500 font-medium">{card.label}</span>
                            <div className={`w-8 h-8 ${card.bg} flex items-center justify-center rounded`}>
                                <card.icon className={`w-4 h-4 ${card.color}`} />
                            </div>
                        </div>
                        <span className="text-3xl font-bold text-white">{loading ? "—" : card.value}</span>
                    </div>
                ))}
            </div>

            {/* Recent Reservations */}
            <div className="bg-slate-900 border border-slate-800">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" /> Recent Reservations
                    </h2>
                    <a href="/admin/reservations" className="text-xs text-amber-400 hover:text-amber-300 uppercase tracking-wider">View All →</a>
                </div>
                <div className="p-6">
                    {loading ? (
                        <p className="text-slate-500 text-center py-8">Loading...</p>
                    ) : stats.recentReservations.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarCheck className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-500">No reservations yet</p>
                            <p className="text-slate-600 text-sm">Bookings will appear here as guests make reservations.</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-[0.65rem] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                    <th className="pb-3">Guest</th>
                                    <th className="pb-3">Room</th>
                                    <th className="pb-3">Check-in</th>
                                    <th className="pb-3">Guests</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentReservations.map((r: any) => (
                                    <tr key={r._id} className="border-b border-slate-800/50">
                                        <td className="py-3 text-white">{r.guestName || `${r.firstName || ''} ${r.lastName || ''}`}</td>
                                        <td className="py-3 text-slate-400 text-sm">{r.roomName || "—"}</td>
                                        <td className="py-3 text-slate-400 text-sm">{r.checkIn ? new Date(r.checkIn).toLocaleDateString() : "—"}</td>
                                        <td className="py-3 text-slate-400">{r.guests}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 text-xs rounded ${r.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" :
                                                    r.status === "cancelled" ? "bg-red-500/10 text-red-400" :
                                                        "bg-amber-500/10 text-amber-400"
                                                }`}>{r.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
