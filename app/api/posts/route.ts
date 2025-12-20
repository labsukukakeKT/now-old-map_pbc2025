import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
        return NextResponse.json({ error: "placeId is required" }, { status: 400 });
    }

    try {
        const posts = await prisma.post.findMany({
            where: {
                place_id: parseInt(placeId)
            },
            include: {
                user_DB: {
                    select: {
                        user_name: true,
                        user_photo_url: true
                    }
                }
            },
            orderBy: {
                uploaded_date: 'desc'
            }
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('GET /api/posts error', error);
        return NextResponse.json({ error: "Failed to fetch posts", detail: String(error) }, { status: 500 });
    }
}
