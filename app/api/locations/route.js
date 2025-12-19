import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const places = await prisma.place_DB.findMany({
            select: {
                place_id: true,
                place_name: true,
                lattitude: true,
                longitude: true,
                place_description: true,
                place_photo_url: true,
                place_era_start: true,
                place_era_end: true,
            },
        });

        const locations = places.map((p) => ({
            id: p.place_id,
            title: p.place_name,
            lat: p.lattitude,
            lng: p.longitude,
            eraStart: p.place_era_start ? new Date(p.place_era_start).getFullYear() : null,
            eraEnd: p.place_era_end ? new Date(p.place_era_end).getFullYear() : null,
            abst: p.place_description,
            detail: p.place_description,
            photoUrl: p.place_photo_url,
        }));

        return NextResponse.json(locations);
    } catch (error) {
        console.error('GET /api/locations error', error);
        return NextResponse.json({ error: "Something went wrong!", detail: String(error) }, { status: 500 });   
    }
}