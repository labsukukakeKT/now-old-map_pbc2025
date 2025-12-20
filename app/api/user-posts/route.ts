import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("user_id");

        if (!userId) {
            return NextResponse.json(
                { error: "user_id is required" },
                { status: 400 }
            );
        }

        const userIdInt = parseInt(userId, 10);
        if (isNaN(userIdInt)) {
            return NextResponse.json(
                { error: "user_id must be a valid number" },
                { status: 400 }
            );
        }

        // Fetch posts by user_id with place information
        const posts = await prisma.post.findMany({
            where: {
                user_id: userIdInt,
            },
            include: {
                place_DB: {
                    select: {
                        place_id: true,
                        place_name: true,
                        place_photo_url: true,
                        lat: true,
                        lng: true,
                    },
                },
            },
            orderBy: {
                uploaded_date: "desc",
            },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }
}
