export type TransactionType = "INCOME" | "EXPENSE";

export type BehavioralTag = "IMPULSE" | "PLANNED" | "NEED" | "EMOTIONAL" | "STATUS";

export type FinancialMindset = "IMPULSIVE" | "SECURE" | "ANXIOUS" | "AVOIDANT";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  onboarded: boolean;
  financialMindset?: FinancialMindset;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
  description?: string;
  behavioralTag?: BehavioralTag;
  moodBefore?: string;
  moodAfter?: string;
  preSpendingCheckId?: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  amountLimit: number;
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  spentAmount: number;
  createdAt: Date;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  createdAt: Date;
}

export interface PreSpendingCheck {
  id: string;
  userId: string;
  itemName: string;
  cost: number;
  needRating: number; // 1-10
  wantRating: number; // 1-10
  happinessDelayDays: number;
  status: "PENDING" | "APPROVED" | "ABANDONED";
  createdAt: Date;
  reviewDate: Date;
}

export interface MoneyLeak {
  id: string;
  userId: string;
  sourceName: string;
  monthlyCost: number;
  leakType: "INACTIVE_SUBSCRIPTION" | "VAMPIRIC_HABIT" | "CONVENIENCE_PREMIUM";
  mitigationPlan: string;
  isResolved: boolean;
  createdAt: Date;
}

export interface SimulationScenario {
  id: string;
  userId: string;
  scenarioName: string;
  description?: string;
  initialBalance: number;
  monthlySavings: number;
  growthRate: number;
  years: number;
  results: Record<string, any>;
  createdAt: Date;
}
