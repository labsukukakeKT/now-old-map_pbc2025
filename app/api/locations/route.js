import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const locations = await prisma.place_DB.findMany();
        return NextResponse.json(locations);
    } catch (error) {
        console.error('GET /api/locations error', error);
        return NextResponse.json({ error: "Something went wrong!", detail: String(error) }, { status: 500 });   
    }
}