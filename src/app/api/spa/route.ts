import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SpaTreatment from "@/models/SpaTreatment";

export async function GET() {
    try {
        await dbConnect();
        const treatments = await SpaTreatment.find().sort({ createdAt: -1 });
        return NextResponse.json(treatments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch spa treatments" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const treatment = await SpaTreatment.create(body);
        return NextResponse.json(treatment, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const body = await request.json();
        const updated = await SpaTreatment.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await SpaTreatment.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
