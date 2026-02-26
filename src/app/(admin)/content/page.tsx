"use client";

import { useState, useEffect } from "react";
import { Save, FileText, Image as ImageIcon, Type, Link2, AlignLeft } from "lucide-react";

interface ContentItem {
    _id: string;
    key: string;
    section: string;
    label: string;
    type: "text" | "textarea" | "image" | "url";
    value: string;
}

export default function ContentPage() {
    const [items, setItems] = useState<ContentItem[]>([]);
    const [edited, setEdited] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeSection, setActiveSection] = useState("all");

    useEffect(() => {
        fetch("/api/content")
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
                if (Array.isArray(data)) setItems(data);
            })
            .catch(err => console.error("Content fetch failed:", err));
    }, []);

    const sections = Array.from(new Set(items.map(i => i.section)));
    const filtered = activeSection === "all" ? items : items.filter(i => i.section === activeSection);

    const handleChange = (key: string, value: string) => {
        setEdited(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const getValue = (item: ContentItem) => edited[item.key] ?? item.value;

    const hasChanges = Object.keys(edited).length > 0;

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = Object.entries(edited).map(([key, value]) => ({ key, value }));
            const res = await fetch("/api/content", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setItems(data);
            }
            setEdited({});
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Content save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const typeIcon = (type: string) => {
        switch (type) {
            case "image": return <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />;
            case "textarea": return <AlignLeft className="w-3.5 h-3.5 text-sky-400" />;
            case "url": return <Link2 className="w-3.5 h-3.5 text-violet-400" />;
            default: return <Type className="w-3.5 h-3.5 text-amber-400" />;
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Site Content</h1>
                    <p className="text-slate-400 mt-1">Edit all text, images, and links across the website.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors ${hasChanges
                            ? "bg-amber-500 text-black hover:bg-amber-400"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : saved ? "Saved ✓" : `Save Changes${hasChanges ? ` (${Object.keys(edited).length})` : ""}`}
                </button>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setActiveSection("all")}
                    className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${activeSection === "all"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "text-slate-400 border-slate-700 hover:border-slate-600"
                        }`}
                >All Sections</button>
                {sections.map(sec => (
                    <button
                        key={sec}
                        onClick={() => setActiveSection(sec)}
                        className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${activeSection === sec
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "text-slate-400 border-slate-700 hover:border-slate-600"
                            }`}
                    >{sec}</button>
                ))}
            </div>

            {/* Content Items */}
            <div className="space-y-4">
                {filtered.map(item => (
                    <div key={item._id} className="bg-slate-900 border border-slate-800 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            {typeIcon(item.type)}
                            <label className="text-sm text-white font-medium">{item.label}</label>
                            <span className="ml-auto text-[0.6rem] uppercase tracking-widest text-slate-600 bg-slate-800 px-2 py-0.5">{item.section}</span>
                            {edited[item.key] !== undefined && (
                                <span className="text-[0.6rem] uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5">Modified</span>
                            )}
                        </div>

                        {item.type === "textarea" ? (
                            <textarea
                                value={getValue(item)}
                                onChange={e => handleChange(item.key, e.target.value)}
                                rows={3}
                                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
                            />
                        ) : item.type === "image" ? (
                            <div className="flex gap-4 items-start">
                                <input
                                    value={getValue(item)}
                                    onChange={e => handleChange(item.key, e.target.value)}
                                    className="flex-1 bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    placeholder="Image URL or upload path"
                                />
                                {getValue(item) && (
                                    <div className="w-20 h-14 bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                                        <img src={getValue(item)} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <input
                                value={getValue(item)}
                                onChange={e => handleChange(item.key, e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                placeholder={item.type === "url" ? "https://..." : ""}
                            />
                        )}
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16 bg-slate-900 border border-slate-800">
                    <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500">No content items found.</p>
                </div>
            )}
        </div>
    );
}
