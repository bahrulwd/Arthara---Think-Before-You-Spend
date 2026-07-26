import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "default-user-id";

    // Get current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Fetch all transactions for this month
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Calculate income and expense
    let income = 0;
    let expense = 0;

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === "INCOME") {
        income += amount;
      } else if (tx.type === "EXPENSE") {
        expense += amount;
      }
    });

    const netCashflow = income - expense;

    // Calculate Health Score
    // Formula: baseline 50 + (savingsRate * 0.5), capped between 10 and 100.
    let healthScore: number | null = null;
    if (transactions.length > 0) {
      if (income > 0) {
        const savingsRate = (netCashflow / income) * 100;
        healthScore = Math.max(10, Math.min(100, Math.floor(50 + savingsRate * 0.5)));
      } else if (expense > 0) {
        healthScore = 30; // low score if only expenses
      } else {
        healthScore = 50; // default baseline if net cashflow is zero
      }
    }

    // Fetch all budgets
    const dbBudgets = await prisma.budget.findMany({
      where: { userId },
    });

    // Fetch total expenses grouped by category
    const expenseGroups = await prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Map spent amounts to budgets
    const budgetsData = dbBudgets.map((budget) => {
      const group = expenseGroups.find(
        (g) => g.category.toLowerCase() === budget.category.toLowerCase()
      );
      const spent = group?._sum?.amount ? Number(group._sum.amount) : 0;
      const limit = Number(budget.amountLimit);
      
      // Determine status
      let status = "SAFE";
      const ratio = spent / limit;
      if (ratio >= 1.0) {
        status = "CRITICAL";
      } else if (ratio >= 0.8) {
        status = "WARNING";
      }

      return {
        id: budget.id,
        category: budget.category,
        spent,
        limit,
        status,
        period: budget.period,
      };
    });

    // Also get the list of recent transactions (say last 5)
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    });

    // Fetch latest unresolved money leak
    const latestLeak = await prisma.moneyLeak.findFirst({
      where: { userId, isResolved: false },
      orderBy: { createdAt: "desc" },
    });

    // Fetch latest financial goal
    const latestGoal = await prisma.financialGoal.findFirst({
      where: { userId },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json({
      netCashflow,
      income,
      expense,
      healthScore,
      budgets: budgetsData,
      recentTransactions,
      latestLeak,
      latestGoal,
    });
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch dashboard metrics" }, { status: 500 });
  }
}
