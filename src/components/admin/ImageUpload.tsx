"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
}

export default function ImageUpload({ value, onChange, folder = "hotel", label = "Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFile(file: File) {
        if (!file.type.startsWith("image/")) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) onChange(data.url);
        } catch (err) {
            console.error("Upload failed:", err);
        }
        setUploading(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    }

    return (
        <div>
            <label className="text-xs uppercase tracking-widest text-slate-400 font-medium block mb-2">{label}</label>

            {value ? (
                <div className="relative group">
                    <div className="relative w-full h-40 bg-slate-800 border border-slate-700 overflow-hidden">
                        <Image src={value} alt="Uploaded" fill className="object-cover" sizes="400px" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="bg-amber-500 text-black px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="bg-red-500 text-white p-1.5"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => !uploading && inputRef.current?.click()}
                    className={`border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${dragOver
                            ? "border-amber-400 bg-amber-500/5"
                            : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                        }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                            <span className="text-sm text-slate-400">Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6 text-slate-500" />
                            <span className="text-sm text-slate-400">Click or drag image to upload</span>
                            <span className="text-xs text-slate-600">JPG, PNG, WebP • Max 10MB</span>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {/* URL fallback */}
            <div className="mt-2">
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-amber-500 transition-colors"
                />
            </div>
        </div>
    );
}
