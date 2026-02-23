import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Dish from "@/models/Dish";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const query: any = {};
        if (category && category !== "all") query.category = category;
        const dishes = await Dish.find(query).sort({ category: 1, name: 1 });
        return NextResponse.json(dishes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const dish = await Dish.create(body);
        return NextResponse.json(dish, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
