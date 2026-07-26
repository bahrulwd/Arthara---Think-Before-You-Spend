import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { mindset } = body;

    const financialMindset = mindset || "SECURE";

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        onboarded: true,
        financialMindset,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        onboarded: user.onboarded,
        financialMindset: user.financialMindset,
      },
    });
  } catch (error) {
    console.error("Onboarding API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update onboarding state" },
      { status: 500 }
    );
  }
}
