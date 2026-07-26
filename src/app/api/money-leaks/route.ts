import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    const leaks = await prisma.moneyLeak.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leaks);
  } catch (error: any) {
    console.error("Failed to fetch money leaks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";
    const body = await request.json();
    const { id, isResolved } = body;

    if (!id) {
      return NextResponse.json({ error: "Leak ID is required" }, { status: 400 });
    }

    const updatedLeak = await prisma.moneyLeak.update({
      where: { id, userId },
      data: { isResolved: Boolean(isResolved) },
    });

    return NextResponse.json(updatedLeak);
  } catch (error: any) {
    console.error("Failed to update money leak:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
