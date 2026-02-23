import { NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "hotel";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadImage(buffer, folder);

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { publicId } = await request.json();
        if (!publicId) {
            return NextResponse.json({ error: "publicId required" }, { status: 400 });
        }
        await deleteImage(publicId);
        return NextResponse.json({ message: "Image deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
    }
}
