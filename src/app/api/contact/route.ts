import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ContactInquiry from "@/models/ContactInquiry";

export async function GET() {
    try {
        await dbConnect();
        const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
        return NextResponse.json(inquiries);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const inquiry = await ContactInquiry.create(body);
        return NextResponse.json(inquiry, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
