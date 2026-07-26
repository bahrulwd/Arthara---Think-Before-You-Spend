import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const userId = "default-user-id";

    // 1. Seed or update default user
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        email: "muhbahrulwd@gmail.com",
        password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // SHA-256 for password123
        name: "Muhammad Bahrul Widad",
        onboarded: true,
        financialMindset: "SECURE",
      },
      create: {
        id: userId,
        email: "muhbahrulwd@gmail.com",
        password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // SHA-256 for password123
        name: "Muhammad Bahrul Widad",
        onboarded: true,
        financialMindset: "SECURE",
      },
    });

    // Clean up existing data to avoid conflicts or duplicate seeds
    await prisma.budget.deleteMany({ where: { userId } });
    await prisma.transaction.deleteMany({ where: { userId } });
    await prisma.financialGoal.deleteMany({ where: { userId } });
    await prisma.moneyLeak.deleteMany({ where: { userId } });
    await prisma.preSpendingCheck.deleteMany({ where: { userId } });
    await prisma.simulation.deleteMany({ where: { userId } });

    // 2. Budgets
    await prisma.budget.createMany({
      data: [
        { userId, category: "Food & Drinks", amountLimit: 2500000, period: "MONTHLY" },
        { userId, category: "Lifestyle", amountLimit: 1500000, period: "MONTHLY" },
        { userId, category: "Transport", amountLimit: 800000, period: "MONTHLY" },
        { userId, category: "Health", amountLimit: 1000000, period: "MONTHLY" },
        { userId, category: "Housing", amountLimit: 4000000, period: "MONTHLY" },
      ],
    });

    // 3. Transactions
    // Let's create transactions for last month (June) and this month (July)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    // Generate dates based on June and July (or relative to now)
    const getRelativeDate = (monthOffset: number, day: number) => {
      const d = new Date(currentYear, currentMonth + monthOffset, day, 12, 0, 0);
      return d;
    };

    await prisma.transaction.createMany({
      data: [
        // --- INCOME JULY ---
        {
          userId,
          amount: 18500000,
          type: "INCOME",
          category: "Salary",
          date: getRelativeDate(0, 1),
          description: "Gaji Utama Bulanan",
        },
        {
          userId,
          amount: 3500000,
          type: "INCOME",
          category: "Freelance",
          date: getRelativeDate(0, 10),
          description: "Proyek Pembuatan Website Landing Page",
        },

        // --- EXPENSES JULY ---
        {
          userId,
          amount: 3500000,
          type: "EXPENSE",
          category: "Housing",
          date: getRelativeDate(0, 1),
          description: "Biaya Sewa Apartemen",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 650000,
          type: "EXPENSE",
          category: "Food & Drinks",
          date: getRelativeDate(0, 3),
          description: "Belanja Bulanan Supermarket",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 75000,
          type: "EXPENSE",
          category: "Food & Drinks",
          date: getRelativeDate(0, 4),
          description: "Kopi Starbucks Sore",
          behavioralTag: "IMPULSE",
          moodBefore: "Stressed",
          moodAfter: "Regretful",
        },
        {
          userId,
          amount: 1200000,
          type: "EXPENSE",
          category: "Lifestyle",
          date: getRelativeDate(0, 5),
          description: "Mechanical Keyboard Keychron",
          behavioralTag: "WANT",
          moodBefore: "Happy",
          moodAfter: "Regretful",
        },
        {
          userId,
          amount: 150000,
          type: "EXPENSE",
          category: "Transport",
          date: getRelativeDate(0, 6),
          description: "Top-up Saldo Kartu MRT",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 450000,
          type: "EXPENSE",
          category: "Health",
          date: getRelativeDate(0, 7),
          description: "Membership Gold Gym",
          behavioralTag: "INVESTMENT",
          moodBefore: "Happy",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 320000,
          type: "EXPENSE",
          category: "Food & Drinks",
          date: getRelativeDate(0, 8),
          description: "Dine-out Sushi Tei",
          behavioralTag: "WANT",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 180000,
          type: "EXPENSE",
          category: "Health",
          date: getRelativeDate(0, 12),
          description: "Beli Vitamin & Suplemen",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 150000,
          type: "EXPENSE",
          category: "Lifestyle",
          date: getRelativeDate(0, 15),
          description: "Langganan Netflix Premium",
          behavioralTag: "WANT",
          moodBefore: "Bored",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 120000,
          type: "EXPENSE",
          category: "Transport",
          date: getRelativeDate(0, 16),
          description: "Tarif GrabCar Bandara",
          behavioralTag: "WANT",
          moodBefore: "Stressed",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 850000,
          type: "EXPENSE",
          category: "Lifestyle",
          date: getRelativeDate(0, 17),
          description: "Belanja Baju ZARA",
          behavioralTag: "IMPULSE",
          moodBefore: "Bored",
          moodAfter: "Regretful",
        },
        {
          userId,
          amount: 580000,
          type: "EXPENSE",
          category: "Food & Drinks",
          date: getRelativeDate(0, 18),
          description: "Groceries Sayuran & Buah",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 280000,
          type: "EXPENSE",
          category: "Food & Drinks",
          date: getRelativeDate(0, 19),
          description: "Makan Malam Bersama Teman",
          behavioralTag: "WANT",
          moodBefore: "Happy",
          moodAfter: "Satisfied",
        },

        // --- INCOME JUNE ---
        {
          userId,
          amount: 18500000,
          type: "INCOME",
          category: "Salary",
          date: getRelativeDate(-1, 1),
          description: "Gaji Utama Bulanan",
        },
        {
          userId,
          amount: 2800000,
          type: "INCOME",
          category: "Freelance",
          date: getRelativeDate(-1, 12),
          description: "Desain UI/UX Mobile App",
        },

        // --- EXPENSES JUNE ---
        {
          userId,
          amount: 3500000,
          type: "EXPENSE",
          category: "Housing",
          date: getRelativeDate(-1, 1),
          description: "Biaya Sewa Apartemen",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 700000,
          type: "EXPENSE",
          category: "Food & Drinks",
          date: getRelativeDate(-1, 3),
          description: "Belanja Bulanan Supermarket",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 1500000,
          type: "EXPENSE",
          category: "Lifestyle",
          date: getRelativeDate(-1, 5),
          description: "Tiket Konser Musik",
          behavioralTag: "WANT",
          moodBefore: "Happy",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 180000,
          type: "EXPENSE",
          category: "Transport",
          date: getRelativeDate(-1, 6),
          description: "MRT & Commuter Line Commute",
          behavioralTag: "NEED",
          moodBefore: "Calm",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 350000,
          type: "EXPENSE",
          category: "Health",
          date: getRelativeDate(-1, 10),
          description: "Konsultasi Dokter & Obat Flu",
          behavioralTag: "NEED",
          moodBefore: "Stressed",
          moodAfter: "Satisfied",
        },
        {
          userId,
          amount: 120000,
          type: "EXPENSE",
          category: "Food & Drinks",
          date: getRelativeDate(-1, 15),
          description: "Kopi Senja di Cafe",
          behavioralTag: "IMPULSE",
          moodBefore: "Stressed",
          moodAfter: "Regretful",
        },
        {
          userId,
          amount: 950000,
          type: "EXPENSE",
          category: "Lifestyle",
          date: getRelativeDate(-1, 20),
          description: "Sepatu Sneaker Flash Sale",
          behavioralTag: "WANT",
          moodBefore: "Happy",
          moodAfter: "Regretful",
        },
      ],
    });

    // 4. Financial Goals
    await prisma.financialGoal.createMany({
      data: [
        {
          userId,
          name: "Dana Darurat Mandiri",
          targetAmount: 50000000,
          currentAmount: 18000000,
          deadline: getRelativeDate(5, 31), // Dec 31
          priority: "HIGH",
        },
        {
          userId,
          name: "Tabungan Liburan Jepang",
          targetAmount: 25000000,
          currentAmount: 6000000,
          deadline: getRelativeDate(11, 30), // Mid next year
          priority: "MEDIUM",
        },
      ],
    });

    // 5. Money Leaks
    await prisma.moneyLeak.createMany({
      data: [
        {
          userId,
          sourceName: "Langganan 3 Streaming Musik Paralel (Spotify, Apple, YouTube)",
          monthlyCost: 139000,
          leakType: "INACTIVE_SUBSCRIPTION",
          mitigationPlan: "Batalkan Spotify & Apple Music, pertahankan YouTube Premium Family.",
          isResolved: false,
        },
        {
          userId,
          sourceName: "Kopi Susu Kekinian Setiap Sore Hari Kerja",
          monthlyCost: 750000,
          leakType: "VAMPIRIC_HABIT",
          mitigationPlan: "Beli biji kopi kiloan & seduh sendiri menggunakan mesin kantor.",
          isResolved: false,
        },
      ],
    });

    // 6. Pre-Spending Checks
    await prisma.preSpendingCheck.createMany({
      data: [
        {
          userId,
          itemName: "Sepatu Sneakers Kolaborasi Limited",
          cost: 1800000,
          needRating: 3,
          wantRating: 9,
          happinessDelayDays: 7,
          status: "PENDING",
          reviewDate: getRelativeDate(0, 26),
        },
        {
          userId,
          itemName: "Smartwatch Pintar Kesehatan",
          cost: 3200000,
          needRating: 6,
          wantRating: 8,
          happinessDelayDays: 14,
          status: "APPROVED",
          reviewDate: getRelativeDate(0, 15),
        },
        {
          userId,
          itemName: "Upgrade Knalpot Racing Motor",
          cost: 2500000,
          needRating: 1,
          wantRating: 10,
          happinessDelayDays: 10,
          status: "ABANDONED",
          reviewDate: getRelativeDate(0, 10),
        },
      ],
    });

    // 7. Simulations
    await prisma.simulation.createMany({
      data: [
        {
          userId,
          scenarioName: "Proyeksi Nabung Konsisten",
          description: "Menginvestasikan Rp1.5M/bulan dengan imbal hasil 7% per tahun.",
          initialBalance: 10000000,
          monthlySavings: 1500000,
          growthRate: 0.07,
          years: 5,
          results: JSON.stringify([
            { year: 0, balance: 10000000 },
            { year: 1, balance: 29080000 },
            { year: 2, balance: 49495600 },
            { year: 3, balance: 71340292 },
            { year: 4, balance: 94714112 },
            { year: 5, balance: 119724100 },
          ]),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Database dummy data seeded successfully for default-user-id",
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
