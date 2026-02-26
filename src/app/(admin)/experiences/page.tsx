"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Compass, Plus, Trash2, Pencil, X } from "lucide-react";

interface Experience {
    _id: string;
    title: string;
    category: string;
    duration: string;
    description: string;
    image: string;
    isActive: boolean;
}

const CATEGORIES = ["Adventure", "Romantic", "Culture", "Workshop", "Wellness", "Culinary", "Sport"];

const EMPTY_FORM = { title: "", category: "Adventure", duration: "", description: "", image: "", isActive: true };

export default function AdminExperiencesPage() {
    const [items, setItems] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Experience | null>(null);
    const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    async function fetchItems() {
        try {
            const res = await fetch("/api/experiences");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        setLoading(false);
    }

    useEffect(() => { fetchItems(); }, []);

    function openAdd() {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    }

    function openEdit(item: Experience) {
        setEditing(item);
        setForm({ title: item.title, category: item.category, duration: item.duration, description: item.description, image: item.image, isActive: item.isActive });
        setShowModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                await fetch(`/api/experiences?id=${editing._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            } else {
                await fetch("/api/experiences", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            }
            setShowModal(false);
            fetchItems();
        } catch (err) { console.error(err); }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this experience?")) return;
        await fetch(`/api/experiences?id=${id}`, { method: "DELETE" });
        fetchItems();
    }

    async function toggleActive(item: Experience) {
        await fetch(`/api/experiences?id=${item._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !item.isActive }),
        });
        fetchItems();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Experiences</h1>
                    <p className="text-slate-400 text-sm mt-1">{items.length} total</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Experience
                </button>
            </div>

            {loading ? (
                <div className="p-10 text-center text-slate-500">Loading...</div>
            ) : items.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-10 text-center text-slate-500">
                    <Compass className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p>No experiences yet. Add your first experience.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item._id} className={`bg-slate-900 border overflow-hidden ${item.isActive ? "border-slate-800" : "border-slate-800 opacity-60"}`}>
                            {item.image && (
                                <div className="relative aspect-video">
                                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                                </div>
                            )}
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <span className={`text-xs px-2 py-0.5 font-ui uppercase tracking-wider whitespace-nowrap ${item.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-700 text-slate-400"}`}>
                                        {item.isActive ? "Active" : "Hidden"}
                                    </span>
                                </div>
                                <p className="text-amber-400 text-xs uppercase tracking-wider mb-1">{item.category} • {item.duration}</p>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(item)} className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors px-2 py-1 border border-amber-400/30 hover:border-amber-400/60">
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={() => toggleActive(item)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 border border-slate-700 hover:border-slate-500">
                                        {item.isActive ? "Hide" : "Show"}
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 border border-red-400/30 hover:border-red-400/60 ml-auto">
                                        <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h2 className="text-white font-semibold">{editing ? "Edit Experience" : "Add Experience"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Title *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Category *</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:border-amber-500">
                                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Duration *</label>
                                    <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 Hours" required className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Image URL *</label>
                                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." required className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="text-slate-400 text-xs uppercase tracking-wider block mb-1">Description *</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 focus:outline-none focus:border-amber-500 resize-none" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-amber-500" />
                                <label htmlFor="isActive" className="text-slate-300 text-sm">Active (visible on website)</label>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold py-2.5 text-sm uppercase tracking-wider transition-colors">
                                    {saving ? "Saving..." : editing ? "Save Changes" : "Add Experience"}
                                </button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors text-sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
