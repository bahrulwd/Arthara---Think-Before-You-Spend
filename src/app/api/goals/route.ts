import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.financialGoal.findMany({
      where: { userId },
      orderBy: { deadline: "asc" },
    });

    // Fetch the user to get their dynamic mindset category
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { financialMindset: true },
    });

    return NextResponse.json({
      goals,
      financialMindset: user?.financialMindset || "SECURE",
    });
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, targetAmount, deadline, priority } = body;

    if (!name || !targetAmount || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newGoal = await prisma.financialGoal.create({
      data: {
        userId,
        name,
        targetAmount: Number(targetAmount),
        currentAmount: 0,
        deadline: new Date(deadline),
        priority: priority || "MEDIUM",
      },
    });

    return NextResponse.json({ success: true, goal: newGoal });
  } catch (error) {
    console.error("Failed to create goal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
