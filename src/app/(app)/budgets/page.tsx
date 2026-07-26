"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faPlus,
  faSpinner,
  faTriangleExclamation,
  faLightbulb,
  faUtensils,
  faBagShopping,
  faCar,
  faHeart,
  faHouse,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonBudgets } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";
import { useEffect } from "react";

// Form Validation Schema
const budgetSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  amountLimit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget limit must be a positive number",
  }),
  period: z.enum(["WEEKLY", "MONTHLY"]),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

const getCategoryConfig = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("makan")) {
    return { icon: faUtensils, color: "#F59E0B" };
  } else if (cat.includes("life") || cat.includes("gaya")) {
    return { icon: faBagShopping, color: "#EF4444" };
  } else if (cat.includes("trans") || cat.includes("jalan")) {
    return { icon: faCar, color: "#BFFF00" };
  } else if (cat.includes("heal") || cat.includes("sehat")) {
    return { icon: faHeart, color: "#10B981" };
  } else if (cat.includes("hous") || cat.includes("rumah")) {
    return { icon: faHouse, color: "#3B82F6" };
  }
  return { icon: faWallet, color: "#A855F7" };
};

export default function BudgetsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<"idle" | "loading" | "success">("idle");
  const [budgets, setBudgets] = useState<any[]>([]);

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      if (data && Array.isArray(data.budgets)) {
        const mapped = data.budgets.map((b: any) => {
          const config = getCategoryConfig(b.category);
          return {
            id: b.id,
            category: b.category,
            spent: Number(b.spent),
            limit: Number(b.limit),
            status: b.status,
            icon: config.icon,
            color: config.color,
          };
        });
        setBudgets(mapped);
      }
    } catch (err) {
      console.error("Failed to load budgets:", err);
    }
  };

  useEffect(() => {
    const initAndFetch = async () => {
      setIsPageLoading(true);
      const startTime = Date.now();
      try {
        await fetch("/api/init");
        await fetchBudgets();
      } catch (err) {
        console.error(err);
      } finally {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0);
        if (remainingDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }
        setIsPageLoading(false);
      }
    };
    initAndFetch();
  }, []);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "Food & Drinks",
      amountLimit: "",
      period: "MONTHLY",
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    setIsSubmitting("loading");
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsSubmitting("success");
        await fetchBudgets();
        setTimeout(() => {
          setShowAddForm(false);
          reset();
          setIsSubmitting("idle");
        }, 800);
      } else {
        setIsSubmitting("idle");
      }
    } catch (err) {
      console.error("Failed to save budget:", err);
      setIsSubmitting("idle");
    }
  };

  if (isPageLoading) {
    return <SkeletonBudgets />;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Budgets</h1>
          <p className="text-text-secondary text-sm">Monitor your monthly category limits and prevent money leaks.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          {showAddForm ? "View Budgets" : "New Budget"}
        </button>
      </div>

      {showAddForm ? (
        /* Create Budget Form */
        <div className="bg-card rounded-[24px] border border-border p-6 md:p-8 max-w-xl mx-auto shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Create Budget Limit</h2>
            <p className="text-text-secondary text-xs mt-1">Set a budget limit to receive alerts when spending velocity spikes.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Category</label>
              <div className="relative">
                <select
                  {...register("category")}
                  className="w-full appearance-none bg-background border border-border rounded-[16px] px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  disabled={isSubmitting === "loading"}
                >
                  <option value="Food & Drinks">Food & Drinks</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Transport">Transport</option>
                  <option value="Health">Health</option>
                  <option value="Housing">Housing</option>
                  <option value="Other">Other</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>

            {/* Limit Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Limit Amount</label>
              <div className="relative flex items-center">
                <span className="absolute left-6 text-sm font-bold text-text-secondary">Rp</span>
                <input
                  {...register("amountLimit")}
                  className="w-full bg-background border border-border rounded-[16px] pl-14 pr-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. 1500000"
                  type="text"
                  disabled={isSubmitting === "loading"}
                />
              </div>
              {errors.amountLimit && (
                <p className="text-xs text-red-400 font-bold ml-4 mt-0.5">{errors.amountLimit.message}</p>
              )}
            </div>

            {/* Period Toggle */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Period</label>
              <div className="bg-background border border-border p-1 rounded-full flex w-fit min-w-[200px]">
                <button
                  type="button"
                  onClick={() => setValue("period", "WEEKLY")}
                  className={`flex-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
                    watch("period") === "WEEKLY"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setValue("period", "MONTHLY")}
                  className={`flex-1 py-1.5 px-4 rounded-full text-xs font-bold transition-all ${
                    watch("period") === "MONTHLY"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-text-secondary hover:text-white"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Submit */}
            <LoadingButton
              type="submit"
              state={isSubmitting}
              loadingText="Creating Budget..."
              successText="Tersimpan!"
              className="w-full h-12 bg-primary text-primary-foreground font-bold text-xs rounded-full shadow-lg shadow-primary/10 hover:brightness-105 mt-6"
            >
              Create Budget
            </LoadingButton>
          </form>
        </div>
      ) : (
        /* Budgets List Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Loop over budgets */}
          {budgets.map((budget) => {
            const Icon = budget.icon;
            const percentage = Math.min(Math.round((budget.spent / budget.limit) * 100), 100);
            const remaining = budget.limit - budget.spent;
            
            return (
              <div
                key={budget.id}
                className="bg-card border border-border rounded-[24px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-secondary/15 rounded-xl text-white">
                        <FontAwesomeIcon icon={Icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white leading-none">{budget.category}</h4>
                        <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest block mt-1.5">
                          Rp{budget.spent.toLocaleString("id-ID")} / Rp{budget.limit.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                        budget.status === "CRITICAL"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : budget.status === "WARNING"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      {budget.status.toLowerCase()}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-text-secondary mb-1">
                      <span>{percentage}% used</span>
                      <span className="tabular-nums">Rp{remaining.toLocaleString("id-ID")} left</span>
                    </div>
                    <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border/30">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: budget.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Inline Insights Alert */}
          <div className="col-span-1 md:col-span-3 bg-primary/5 border border-primary/15 rounded-[24px] p-5 flex items-start gap-4">
            <FontAwesomeIcon icon={faLightbulb} className="text-primary w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="font-bold text-white">Insight:</span> Lifestyle budget is at risk of exceeding in 5 days based on your current spending velocity. Consider reallocating from Transport.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
