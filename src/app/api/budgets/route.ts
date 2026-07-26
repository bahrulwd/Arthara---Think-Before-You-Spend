import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    const budgets = await prisma.budget.findMany({
      where: { userId },
    });
    return NextResponse.json(budgets);
  } catch (error: any) {
    console.error("Failed to fetch budgets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, amountLimit, period } = body;

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    // Use upsert to handle unique constraint on [userId, category, period]
    const budget = await prisma.budget.upsert({
      where: {
        userId_category_period: {
          userId,
          category,
          period,
        },
      },
      update: {
        amountLimit: Number(amountLimit),
      },
      create: {
        userId,
        category,
        amountLimit: Number(amountLimit),
        period,
      },
    });

    return NextResponse.json(budget);
  } catch (error: any) {
    console.error("Failed to save budget:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
