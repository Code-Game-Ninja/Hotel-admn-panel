import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/models/Restaurant";

export async function GET() {
    try {
        await dbConnect();
        const restaurants = await Restaurant.find({ isActive: true });
        return NextResponse.json(restaurants);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const restaurant = await Restaurant.create(body);
        return NextResponse.json(restaurant, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
