import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as crypto from "crypto"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, user_name, user_photo_url } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    if (!user_name || !user_name.trim()) {
      return NextResponse.json(
        { error: "User name is required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user_DB.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = hashPassword(password)

    // Create user with provided data
    const user = await prisma.user_DB.create({
      data: {
        email,
        password: hashedPassword,
        user_name: user_name.trim(),
        user_description: null,
        user_photo_url: user_photo_url || null,
      },
    })

    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "User created successfully",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
