import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteContent from "@/models/SiteContent";

// Default content keys - auto-seeded on first GET
const DEFAULTS = [
    // Hero Section
    { key: "hero_title", section: "Hero", label: "Hero Title", type: "text", value: "Grand Horizon" },
    { key: "hero_subtitle", section: "Hero", label: "Hero Subtitle", type: "text", value: "Luxury Resort & Spa" },
    { key: "hero_tagline", section: "Hero", label: "Hero Tagline", type: "textarea", value: "Experience unparalleled luxury in the heart of paradise." },
    { key: "hero_image", section: "Hero", label: "Hero Background Image", type: "image", value: "/images/hero.jpg" },
    { key: "hero_cta", section: "Hero", label: "Hero Button Text", type: "text", value: "Book Your Stay" },

    // About Section
    { key: "about_title", section: "About", label: "About Title", type: "text", value: "A Legacy of Luxury" },
    { key: "about_description", section: "About", label: "About Description", type: "textarea", value: "Since our founding, Grand Horizon has been the epitome of refined hospitality." },
    { key: "about_image", section: "About", label: "About Image", type: "image", value: "/images/about.jpg" },

    // Dining Section
    { key: "dining_title", section: "Dining", label: "Dining Section Title", type: "text", value: "Culinary Excellence" },
    { key: "dining_subtitle", section: "Dining", label: "Dining Subtitle", type: "textarea", value: "Savor the extraordinary. From Michelin-starred innovation to authentic local flavors." },
    { key: "dining_image", section: "Dining", label: "Dining Hero Image", type: "image", value: "/images/dining-hero.jpg" },

    // Rooms Section
    { key: "rooms_title", section: "Rooms", label: "Rooms Section Title", type: "text", value: "Sanctuaries of Peace & Privacy" },
    { key: "rooms_subtitle", section: "Rooms", label: "Rooms Subtitle", type: "textarea", value: "Each retreat is designed for the discerning traveler seeking refined comfort." },
    { key: "rooms_hero_image", section: "Rooms", label: "Rooms Hero Image", type: "image", value: "/images/rooms-hero.jpg" },

    // Contact
    { key: "contact_phone", section: "Contact", label: "Phone Number", type: "text", value: "+1 (888) 123-4567" },
    { key: "contact_email", section: "Contact", label: "Email", type: "text", value: "info@grandhorizon.com" },
    { key: "contact_address", section: "Contact", label: "Address", type: "textarea", value: "123 Oceanview Boulevard, Paradise Bay" },

    // Footer
    { key: "footer_text", section: "Footer", label: "Footer Copyright", type: "text", value: "© 2025 Grand Horizon. All rights reserved." },
    { key: "social_instagram", section: "Footer", label: "Instagram URL", type: "url", value: "" },
    { key: "social_facebook", section: "Footer", label: "Facebook URL", type: "url", value: "" },
    { key: "social_twitter", section: "Footer", label: "Twitter / X URL", type: "url", value: "" },
];

export async function GET() {
    try {
        await dbConnect();
        let content = await SiteContent.find().sort({ section: 1, key: 1 });

        // Auto-seed defaults if empty
        if (content.length === 0) {
            await SiteContent.insertMany(DEFAULTS);
            content = await SiteContent.find().sort({ section: 1, key: 1 });
        }

        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const updates: { key: string; value: string }[] = await request.json();

        const bulkOps = updates.map(({ key, value }) => ({
            updateOne: {
                filter: { key },
                update: { value },
                upsert: true,
            },
        }));

        await SiteContent.bulkWrite(bulkOps);
        const content = await SiteContent.find().sort({ section: 1, key: 1 });
        return NextResponse.json(content);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
