import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount,
      type,
      category,
      date,
      note,
      needLevel,
      spendingTrigger,
      mightRegret,
    } = body;

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount: Number(amount),
        type,
        category,
        date: new Date(date),
        description: note,
        behavioralTag: type === "EXPENSE" ? needLevel : null,
        moodBefore: type === "EXPENSE" ? spendingTrigger : null,
        moodAfter: type === "EXPENSE" ? (mightRegret ? "Regretful" : "Satisfied") : null,
      },
    });

    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error("Failed to create transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      amount,
      type,
      category,
      date,
      note,
      needLevel,
      spendingTrigger,
      mightRegret,
    } = body;

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    const transaction = await prisma.transaction.update({
      where: { id, userId },
      data: {
        amount: Number(amount),
        type,
        category,
        date: new Date(date),
        description: note,
        behavioralTag: type === "EXPENSE" ? needLevel : null,
        moodBefore: type === "EXPENSE" ? spendingTrigger : null,
        moodAfter: type === "EXPENSE" ? (mightRegret ? "Regretful" : "Satisfied") : null,
      },
    });

    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error("Failed to update transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    await prisma.transaction.delete({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
