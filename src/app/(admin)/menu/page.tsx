"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Leaf, Flame, Star, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Dish {
    _id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    image: string;
    isVeg: boolean;
    isSpicy: boolean;
    isPopular: boolean;
    isActive: boolean;
}

const CATEGORIES = ["Starters", "Main Course", "Desserts", "Beverages", "Soups", "Salads", "Specials"];

export default function MenuPage() {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [filter, setFilter] = useState("all");
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<Dish | null>(null);
    const [form, setForm] = useState({
        name: "", category: "Starters", description: "", price: 0, image: "",
        isVeg: false, isSpicy: false, isPopular: false,
    });

    const fetchDishes = () => {
        fetch("/api/menu").then(r => r.json()).then(data => {
            if (Array.isArray(data)) setDishes(data);
        });
    };

    useEffect(() => { fetchDishes(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ name: "", category: "Starters", description: "", price: 0, image: "", isVeg: false, isSpicy: false, isPopular: false });
        setModal(true);
    };

    const openEdit = (d: Dish) => {
        setEditing(d);
        setForm({ name: d.name, category: d.category, description: d.description, price: d.price, image: d.image, isVeg: d.isVeg, isSpicy: d.isSpicy, isPopular: d.isPopular });
        setModal(true);
    };

    const handleSave = async () => {
        const url = editing ? `/api/menu/${editing._id}` : "/api/menu";
        const method = editing ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setModal(false);
        fetchDishes();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this dish?")) return;
        await fetch(`/api/menu/${id}`, { method: "DELETE" });
        fetchDishes();
    };

    const handleToggle = async (d: Dish) => {
        await fetch(`/api/menu/${d._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !d.isActive }),
        });
        fetchDishes();
    };

    const filtered = filter === "all" ? dishes : dishes.filter(d => d.category === filter);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Menu</h1>
                    <p className="text-slate-400 mt-1">Manage your restaurant&apos;s dishes and pricing.</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 text-sm font-medium hover:bg-amber-400 transition-colors">
                    <Plus className="w-4 h-4" /> Add Dish
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button onClick={() => setFilter("all")} className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${filter === "all" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "text-slate-400 border-slate-700 hover:border-slate-600"}`}>All ({dishes.length})</button>
                {CATEGORIES.map(cat => {
                    const count = dishes.filter(d => d.category === cat).length;
                    if (count === 0) return null;
                    return (
                        <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${filter === cat ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "text-slate-400 border-slate-700 hover:border-slate-600"}`}>
                            {cat} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Dishes Table */}
            <div className="bg-slate-900 border border-slate-800 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[0.65rem] uppercase tracking-widest text-slate-500 border-b border-slate-800">
                            <th className="px-6 py-4">Dish</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Tags</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(dish => (
                            <tr key={dish._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {dish.image && (
                                            <img src={dish.image} alt={dish.name} className="w-10 h-10 object-cover rounded" />
                                        )}
                                        <div>
                                            <span className="text-white font-medium">{dish.name}</span>
                                            {dish.description && <p className="text-slate-500 text-xs mt-0.5 max-w-xs truncate">{dish.description}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">{dish.category}</td>
                                <td className="px-6 py-4 text-white font-medium">₹{dish.price}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1.5">
                                        {dish.isVeg && <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[0.6rem] uppercase tracking-wider"><Leaf className="w-3 h-3" /> Veg</span>}
                                        {dish.isSpicy && <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/10 text-orange-400 text-[0.6rem] uppercase tracking-wider"><Flame className="w-3 h-3" /> Spicy</span>}
                                        {dish.isPopular && <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[0.6rem] uppercase tracking-wider"><Star className="w-3 h-3" /> Popular</span>}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleToggle(dish)} className={`px-2.5 py-1 text-xs ${dish.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-700/50 text-slate-500"}`}>
                                        {dish.isActive ? "Active" : "Hidden"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openEdit(dish)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(dish._id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                        <p>No dishes yet. Click &quot;Add Dish&quot; to get started.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                            <h3 className="text-white font-semibold">{editing ? "Edit Dish" : "Add New Dish"}</h3>
                            <button onClick={() => setModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Name</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Category</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Price (₹)</label>
                                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 resize-none" />
                            </div>
                            <ImageUpload
                                value={form.image}
                                onChange={(url) => setForm({ ...form, image: url })}
                                folder="menu"
                                label="Dish Image"
                            />
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="checkbox" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} className="accent-emerald-500" /> Vegetarian
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="checkbox" checked={form.isSpicy} onChange={e => setForm({ ...form, isSpicy: e.target.checked })} className="accent-orange-500" /> Spicy
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                                    <input type="checkbox" checked={form.isPopular} onChange={e => setForm({ ...form, isPopular: e.target.checked })} className="accent-amber-500" /> Popular
                                </label>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-700 flex justify-end gap-3">
                            <button onClick={() => setModal(false)} className="px-5 py-2 text-sm text-slate-400 border border-slate-700 hover:bg-slate-800">Cancel</button>
                            <button onClick={handleSave} className="px-5 py-2 text-sm bg-amber-500 text-black font-medium hover:bg-amber-400">{editing ? "Save Changes" : "Add Dish"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
