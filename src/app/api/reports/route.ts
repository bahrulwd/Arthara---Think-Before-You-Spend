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

    // Fetch all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    // Calculations
    let totalExpense = 0;
    let impulseSpending = 0;
    let stressTriggerCount = 0;
    let promoTriggerCount = 0;
    let socialTriggerCount = 0;
    let regretCount = 0;
    let totalTriggers = 0;

    transactions.forEach((tx) => {
      const amount = Math.abs(Number(tx.amount));
      if (tx.type === "EXPENSE") {
        totalExpense += amount;

        const isImpulse = tx.behavioralTag === "IMPULSE" || tx.behavioralTag === "EMOTIONAL";
        if (isImpulse) {
          impulseSpending += amount;
        }

        // Check triggers
        const desc = (tx.description || "").toLowerCase();
        const isPromo = desc.includes("promo") || desc.includes("sale") || desc.includes("diskon") || desc.includes("discount");
        const isStress = tx.moodBefore === "Stressed" || tx.moodBefore === "Sad";
        const isSocial = tx.behavioralTag === "STATUS" || tx.category.toLowerCase().includes("social") || tx.category.toLowerCase().includes("hangout");

        if (isPromo) promoTriggerCount++;
        if (isStress) stressTriggerCount++;
        if (isSocial) socialTriggerCount++;

        if (isPromo || isStress || isSocial) {
          totalTriggers++;
        }

        // Check regret
        if (tx.moodAfter === "Regretful" || tx.moodAfter === "Guilty") {
          regretCount++;
        }
      }
    });

    const triggerPercentages = {
      promo: totalTriggers > 0 ? Math.round((promoTriggerCount / totalTriggers) * 100) : 0,
      stress: totalTriggers > 0 ? Math.round((stressTriggerCount / totalTriggers) * 100) : 0,
      social: totalTriggers > 0 ? Math.round((socialTriggerCount / totalTriggers) * 100) : 0,
    };

    const shareOfExpense = totalExpense > 0 ? Math.round((impulseSpending / totalExpense) * 100) : 0;

    return NextResponse.json({
      transactions,
      impulseSpending,
      shareOfExpense,
      triggerPercentages,
      regretCount,
    });
  } catch (error) {
    console.error("Failed to generate analytics report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
