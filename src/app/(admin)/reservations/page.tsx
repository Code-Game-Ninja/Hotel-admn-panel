"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Search } from "lucide-react";

const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function AdminReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    async function fetchReservations() {
        const res = await fetch("/api/reservations");
        const data = await res.json();
        setReservations(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    useEffect(() => { fetchReservations(); }, []);

    async function updateStatus(id: string, status: string) {
        await fetch(`/api/reservations/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchReservations();
    }

    const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Reservations</h1>
                    <p className="text-slate-400 text-sm mt-1">{reservations.length} total bookings</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${filter === s ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="bg-slate-900 border border-slate-800">
                {loading ? (
                    <div className="p-10 text-center text-slate-500">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        <CalendarCheck className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p>No reservations found</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                <th className="p-4">Guest</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Check-in</th>
                                <th className="p-4">Check-out</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <p className="text-white">{r.guestName}</p>
                                        <p className="text-slate-500 text-xs">{r.email}</p>
                                    </td>
                                    <td className="p-4 text-slate-400">{r.roomName}</td>
                                    <td className="p-4 text-slate-400">{new Date(r.checkIn).toLocaleDateString()}</td>
                                    <td className="p-4 text-slate-400">{new Date(r.checkOut).toLocaleDateString()}</td>
                                    <td className="p-4 text-white font-medium">${r.totalPrice}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs uppercase tracking-wider border ${statusColors[r.status]}`}>{r.status}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <select
                                            value={r.status}
                                            onChange={(e) => updateStatus(r._id, e.target.value)}
                                            className="bg-slate-800 border border-slate-700 text-white text-xs px-2 py-1 focus:outline-none focus:border-amber-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
