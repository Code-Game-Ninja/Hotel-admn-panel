"use client";

import { useState, useEffect } from "react";
import { Save, Store } from "lucide-react";

interface SettingsData {
    restaurantName: string;
    tagline: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    openingHours: string;
    closingHours: string;
    daysOpen: string;
    socialLinks: { instagram: string; facebook: string; twitter: string };
}

export default function SettingsPage() {
    const [form, setForm] = useState<SettingsData>({
        restaurantName: "", tagline: "", description: "", phone: "", email: "", address: "",
        openingHours: "12:00 PM", closingHours: "11:00 PM", daysOpen: "Monday - Sunday",
        socialLinks: { instagram: "", facebook: "", twitter: "" },
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch("/api/settings")
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
            if (data && !data.error) {
                setForm({
                    restaurantName: data.restaurantName || "",
                    tagline: data.tagline || "",
                    description: data.description || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    address: data.address || "",
                    openingHours: data.openingHours || "12:00 PM",
                    closingHours: data.closingHours || "11:00 PM",
                    daysOpen: data.daysOpen || "Monday - Sunday",
                    socialLinks: data.socialLinks || { instagram: "", facebook: "", twitter: "" },
                });
            }
        })
        .catch(err => console.error("Settings fetch failed:", err));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error("Settings save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-slate-400 mt-1">Configure your restaurant details.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 text-sm font-medium hover:bg-amber-400 transition-colors disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
                </button>
            </div>

            {/* Restaurant Info */}
            <div className="bg-slate-900 border border-slate-800 mb-6">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <h2 className="text-white font-semibold text-sm">Restaurant Information</h2>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Restaurant Name</label>
                            <input value={form.restaurantName} onChange={e => setForm({ ...form, restaurantName: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Tagline</label>
                            <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className={inputClass} placeholder="Fine Dining & Cocktails" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
                    </div>
                </div>
            </div>

            {/* Contact Details */}
            <div className="bg-slate-900 border border-slate-800 mb-6">
                <div className="px-6 py-4 border-b border-slate-800">
                    <h2 className="text-white font-semibold text-sm">Contact Details</h2>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Phone</label>
                            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Email</label>
                            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="info@restaurant.com" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Address</label>
                        <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputClass} />
                    </div>
                </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-slate-900 border border-slate-800 mb-6">
                <div className="px-6 py-4 border-b border-slate-800">
                    <h2 className="text-white font-semibold text-sm">Operating Hours</h2>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Opens At</label>
                            <input value={form.openingHours} onChange={e => setForm({ ...form, openingHours: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Closes At</label>
                            <input value={form.closingHours} onChange={e => setForm({ ...form, closingHours: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Days Open</label>
                            <input value={form.daysOpen} onChange={e => setForm({ ...form, daysOpen: e.target.value })} className={inputClass} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-slate-900 border border-slate-800">
                <div className="px-6 py-4 border-b border-slate-800">
                    <h2 className="text-white font-semibold text-sm">Social Media</h2>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Instagram</label>
                        <input value={form.socialLinks.instagram} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} className={inputClass} placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Facebook</label>
                        <input value={form.socialLinks.facebook} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, facebook: e.target.value } })} className={inputClass} placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-500 mb-1.5 block">Twitter / X</label>
                        <input value={form.socialLinks.twitter} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })} className={inputClass} placeholder="https://x.com/..." />
                    </div>
                </div>
            </div>
        </div>
    );
}
