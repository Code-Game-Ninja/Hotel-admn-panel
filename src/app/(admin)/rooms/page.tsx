"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bed, Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Room {
    _id: string;
    slug: string;
    name: string;
    shortDesc: string;
    price: number;
    size: number;
    occupancy: number;
    bedType: string;
    amenities: string[];
    coverImage: string;
    isActive: boolean;
}

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [form, setForm] = useState({
        name: "", slug: "", shortDesc: "", description: "",
        price: 0, size: 0, occupancy: 2, bedType: "",
        amenities: "", coverImage: "", images: "",
    });

    async function fetchRooms() {
        try {
            const res = await fetch("/api/rooms?all=true");
            const data = await res.json();
            setRooms(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        setLoading(false);
    }

    useEffect(() => { fetchRooms(); }, []);

    function openCreate() {
        setEditingRoom(null);
        setForm({ name: "", slug: "", shortDesc: "", description: "", price: 0, size: 0, occupancy: 2, bedType: "", amenities: "", coverImage: "", images: "" });
        setShowModal(true);
    }

    function openEdit(room: Room) {
        setEditingRoom(room);
        setForm({
            name: room.name, slug: room.slug, shortDesc: room.shortDesc,
            description: "", price: room.price, size: room.size,
            occupancy: room.occupancy, bedType: room.bedType,
            amenities: room.amenities.join(", "), coverImage: room.coverImage, images: "",
        });
        setShowModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const body = {
            ...form,
            price: Number(form.price),
            size: Number(form.size),
            occupancy: Number(form.occupancy),
            amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
            images: form.images ? form.images.split(",").map((i) => i.trim()).filter(Boolean) : [form.coverImage],
        };

        if (editingRoom) {
            await fetch(`/api/rooms/${editingRoom._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        } else {
            await fetch("/api/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        }
        setShowModal(false);
        fetchRooms();
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this room?")) return;
        await fetch(`/api/rooms/${id}`, { method: "DELETE" });
        fetchRooms();
    }

    async function toggleActive(room: Room) {
        await fetch(`/api/rooms/${room._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !room.isActive }),
        });
        fetchRooms();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Rooms</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your room inventory</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors">
                    <Plus className="w-4 h-4" /> Add Room
                </button>
            </div>

            {/* Rooms Table */}
            <div className="bg-slate-900 border border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-500">Loading rooms...</div>
                ) : rooms.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        <Bed className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p>No rooms yet. Click &quot;Add Room&quot; to create one.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-widest text-slate-500 border-b border-slate-800">
                                <th className="p-4">Room</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Size</th>
                                <th className="p-4">Bed</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 relative overflow-hidden shrink-0 bg-slate-800">
                                                <Image src={room.coverImage} alt={room.name} fill className="object-cover" sizes="48px" />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{room.name}</p>
                                                <p className="text-slate-500 text-xs">{room.shortDesc.slice(0, 50)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-white font-medium">${room.price}</td>
                                    <td className="p-4 text-slate-400">{room.size}m²</td>
                                    <td className="p-4 text-slate-400">{room.bedType}</td>
                                    <td className="p-4">
                                        <button onClick={() => toggleActive(room)} className={`flex items-center gap-1.5 px-2 py-1 text-xs uppercase tracking-wider border transition-colors ${room.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-500 border-slate-700"}`}>
                                            {room.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                            {room.isActive ? "Active" : "Hidden"}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(room)} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(room._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-white font-medium">{editingRoom ? "Edit Room" : "Add New Room"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Name *</label>
                                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" required />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Slug</label>
                                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Short Description *</label>
                                <input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" required />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Full Description</label>
                                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500 resize-none" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Price ($) *</label>
                                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" required />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Size (m²) *</label>
                                    <input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: +e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" required />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Occupancy</label>
                                    <input type="number" value={form.occupancy} onChange={(e) => setForm({ ...form, occupancy: +e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Bed Type *</label>
                                    <input value={form.bedType} onChange={(e) => setForm({ ...form, bedType: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" required />
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Amenities (comma-separated)</label>
                                    <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <ImageUpload
                                value={form.coverImage}
                                onChange={(url) => setForm({ ...form, coverImage: url })}
                                folder="rooms"
                                label="Cover Image *"
                            />
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 text-sm text-slate-400 border border-slate-700 hover:bg-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" /> {editingRoom ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
