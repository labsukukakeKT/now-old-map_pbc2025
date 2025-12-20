import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as crypto from "crypto"

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    // Create user with default name
    const user = await prisma.user_DB.create({
      data: {
        email,
        password: hashedPassword,
        user_name: email.split("@")[0], // Use email prefix as default username
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
