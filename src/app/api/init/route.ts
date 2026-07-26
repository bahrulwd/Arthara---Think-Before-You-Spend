import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Seed default user if not exists
    const defaultUser = await prisma.user.upsert({
      where: { email: "muhbahrulwd@gmail.com" },
      update: {
        password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // SHA-256 for password123
        name: "Muhammad Bahrul Widad",
      },
      create: {
        id: "default-user-id",
        email: "muhbahrulwd@gmail.com",
        password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // SHA-256 for password123
        name: "Muhammad Bahrul Widad",
        onboarded: true,
        financialMindset: "SECURE",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      user: defaultUser,
    });
  } catch (error: any) {
    console.error("Initialization error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize" },
      { status: 500 }
    );
  }
}
