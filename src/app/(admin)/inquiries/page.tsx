"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Mail, Check, Eye } from "lucide-react";

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any | null>(null);

    async function fetchInquiries() {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setInquiries(Array.isArray(data) ? data : []);
        setLoading(false);
    }

    useEffect(() => { fetchInquiries(); }, []);

    const unreadCount = inquiries.filter((i) => !i.isRead).length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white tracking-tight">Contact Inquiries</h1>
                <p className="text-slate-400 text-sm mt-1">{unreadCount} unread of {inquiries.length} total</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inbox List */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-slate-500">Loading...</div>
                    ) : inquiries.length === 0 ? (
                        <div className="p-10 text-center text-slate-500">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                            <p>No inquiries yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {inquiries.map((inquiry) => (
                                <button
                                    key={inquiry._id}
                                    onClick={() => setSelected(inquiry)}
                                    className={`w-full text-left p-4 hover:bg-slate-800/50 transition-colors ${selected?._id === inquiry._id ? "bg-slate-800/80 border-l-2 border-amber-400" : "border-l-2 border-transparent"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm font-medium ${inquiry.isRead ? "text-slate-400" : "text-white"}`}>
                                            {inquiry.firstName} {inquiry.lastName}
                                        </span>
                                        {!inquiry.isRead && <div className="w-2 h-2 bg-amber-400 rounded-full" />}
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">{inquiry.subject}</p>
                                    <p className="text-xs text-slate-600 line-clamp-1">{inquiry.message}</p>
                                    <p className="text-[0.6rem] text-slate-600 mt-1">{new Date(inquiry.createdAt).toLocaleString()}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-6">
                    {selected ? (
                        <div>
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
                                <div>
                                    <h2 className="text-white text-lg font-medium">{selected.subject}</h2>
                                    <p className="text-slate-400 text-sm">{selected.firstName} {selected.lastName}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Mail className="w-3 h-3" />
                                    <a href={`mailto:${selected.email}`} className="text-amber-400 hover:underline">{selected.email}</a>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                            <p className="text-xs text-slate-600 mt-6">Received: {new Date(selected.createdAt).toLocaleString()}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <Eye className="w-8 h-8 mb-2 text-slate-600" />
                            <p>Select an inquiry to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
