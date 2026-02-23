"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, Plus, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface GalleryImg {
    _id: string;
    src: string;
    category: string;
    title: string;
}

const categories = ["Rooms", "Dining", "Exteriors", "Experiences"];

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImg[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ src: "", category: "Rooms", title: "" });

    async function fetchImages() {
        try {
            const res = await fetch("/api/gallery");
            const data = await res.json();
            setImages(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        setLoading(false);
    }

    useEffect(() => { fetchImages(); }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        setShowModal(false);
        setForm({ src: "", category: "Rooms", title: "" });
        fetchImages();
    }

    async function handleDelete(id: string) {
        if (!confirm("Remove this image from gallery?")) return;
        await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
        fetchImages();
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Gallery</h1>
                    <p className="text-slate-400 text-sm mt-1">{images.length} images</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors">
                    <Plus className="w-4 h-4" /> Add Image
                </button>
            </div>

            {loading ? (
                <div className="p-10 text-center text-slate-500">Loading...</div>
            ) : images.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-10 text-center text-slate-500">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p>No gallery images yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {images.map((img) => (
                        <div key={img._id} className="relative group bg-slate-900 border border-slate-800 overflow-hidden">
                            <div className="aspect-square relative">
                                <Image src={img.src} alt={img.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                            </div>
                            <div className="p-3">
                                <p className="text-white text-sm truncate">{img.title}</p>
                                <p className="text-amber-400 text-xs uppercase tracking-wider">{img.category}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(img._id)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500/90 text-white p-1.5 transition-opacity"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-md">
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                            <h2 className="text-white font-medium">Add Gallery Image</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <ImageUpload
                                value={form.src}
                                onChange={(url) => setForm({ ...form, src: url })}
                                folder="gallery"
                                label="Image *"
                            />
                            <div>
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Title *</label>
                                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500" required />
                            </div>
                            <div>
                                <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-1">Category *</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500">
                                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors">Add Image</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
