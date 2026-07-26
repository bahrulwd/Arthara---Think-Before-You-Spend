"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faPlus,
  faSpinner,
  faCalendar,
  faPiggyBank,
  faLaptop,
  faCircleQuestion,
  faLightbulb,
  faStar,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonGoals } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";

// Form Validation Schema
const goalSchema = z.object({
  name: z.string().min(2, "Goal name must be at least 2 characters"),
  targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Target amount must be a positive number",
  }),
  deadline: z.string().min(1, "Please select a target deadline"),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export default function GoalsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [goals, setGoals] = useState<any[]>([]);
  const [financialMindset, setFinancialMindset] = useState("SECURE");
  const [netCashflow, setNetCashflow] = useState<number>(5000000);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      targetAmount: "",
      deadline: new Date().toISOString().split("T")[0],
      priority: "MEDIUM",
    },
  });

  const [submittingState, setSubmittingState] = useState<"idle" | "loading" | "success">("idle");

  const fetchGoals = async (isInitial = false) => {
    const startTime = Date.now();
    try {
      const res = await fetch("/api/goals");
      const resData = await res.json();
      if (res.ok) {
        setGoals(resData.goals || []);
        setFinancialMindset(resData.financialMindset || "SECURE");
      }
      
      const dashRes = await fetch("/api/dashboard");
      const dashData = await dashRes.json();
      if (dashRes.ok && dashData.netCashflow) {
        setNetCashflow(dashData.netCashflow > 0 ? Number(dashData.netCashflow) : 5000000);
      }
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      if (isInitial) {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0);
        if (remainingDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }
      }
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals(true);
  }, []);

  const onSubmit = async (data: GoalFormValues) => {
    setSubmittingState("loading");
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSubmittingState("success");
        await fetchGoals();
        setTimeout(() => {
          setShowAddForm(false);
          reset();
          setSubmittingState("idle");
        }, 800);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create goal");
        setSubmittingState("idle");
      }
    } catch (err) {
      console.error("Failed to submit goal:", err);
      setSubmittingState("idle");
    }
  };

  const getGoalIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("emergency") || n.includes("darurat")) return faPiggyBank;
    if (n.includes("laptop") || n.includes("work") || n.includes("kerja")) return faLaptop;
    return faBullseye;
  };

  // Deduce weights
  const getWeights = () => {
    switch (financialMindset) {
      case "IMPULSIVE":
        return [
          { name: "Emergency Fund", weight: 2, bg: "bg-primary/20" },
          { name: "Career", weight: 3, bg: "bg-primary/50" },
          { name: "Traveling", weight: 5, bg: "bg-primary" },
        ];
      case "ANXIOUS":
        return [
          { name: "Emergency Fund", weight: 4, bg: "bg-primary/80" },
          { name: "Career", weight: 4, bg: "bg-primary/80" },
          { name: "Traveling", weight: 3, bg: "bg-primary/40" },
        ];
      default: // SECURE
        return [
          { name: "Emergency Fund", weight: 5, bg: "bg-primary" },
          { name: "Career", weight: 4, bg: "bg-primary/85" },
          { name: "Traveling", weight: 2, bg: "bg-primary/30" },
        ];
    }
  };

  const getSmartAllocations = () => {
    const weights = getWeights();
    const totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);

    return goals.map((goal) => {
      const name = goal.name.toLowerCase();
      let priorityName = "Career";
      let priorityBg = "bg-primary/85";

      if (name.includes("darurat") || name.includes("emergency") || name.includes("aman")) {
        priorityName = "Emergency Fund";
        priorityBg = "bg-primary";
      } else if (
        name.includes("liburan") ||
        name.includes("travel") ||
        name.includes("jalan") ||
        name.includes("leisure") ||
        name.includes("jepang")
      ) {
        priorityName = "Traveling";
        priorityBg = "bg-primary/30";
      }

      const weightObj = weights.find((w) => w.name === priorityName) || { weight: 3, bg: priorityBg };
      const ratio = totalWeight > 0 ? weightObj.weight / totalWeight : 0;
      const amount = Math.round(netCashflow * ratio);

      const target = Number(goal.targetAmount);
      const collected = Number(goal.currentAmount);
      const remaining = Math.max(target - collected, 0);
      const estMonths = amount > 0 ? Math.ceil(remaining / amount) : null;

      return {
        id: goal.id,
        goalName: goal.name,
        priorityName,
        percentage: Math.round(ratio * 100),
        amount,
        estMonths,
      };
    });
  };

  const priorities = getWeights();

  if (isPageLoading) {
    return <SkeletonGoals />;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Financial Goals</h1>
          <p className="text-text-secondary text-sm">Define and track savings targets mapped to your long-term priorities.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10 cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          {showAddForm ? "View Goals" : "New Goal"}
        </button>
      </div>

      {showAddForm ? (
        /* Create Goal Form Centered Layout */
        <div className="max-w-xl mx-auto w-full bg-card border border-border rounded-[24px] p-6 md:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Create Savings Goal</h2>
            <p className="text-text-secondary text-xs mt-1">Setup your targets and timeline to initialize smart allocations.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Goal Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Goal Name</label>
              <input
                {...register("name")}
                className="w-full h-12 px-6 rounded-full bg-background border border-border text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="e.g. Vacation to Bali"
                type="text"
                disabled={submittingState === "loading"}
              />
              {errors.name && (
                <p className="text-xs text-red-400 font-bold ml-4 mt-0.5">{errors.name.message}</p>
              )}
            </div>

            {/* Target Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Target Amount</label>
              <div className="relative flex items-center">
                <span className="absolute left-6 text-sm font-bold text-text-secondary">Rp</span>
                <input
                  {...register("targetAmount")}
                  className="w-full h-12 px-6 rounded-full bg-background border border-border text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  placeholder="e.g. 10000000"
                  type="text"
                  disabled={submittingState === "loading"}
                />
              </div>
              {errors.targetAmount && (
                <p className="text-xs text-red-400 font-bold ml-4 mt-0.5">{errors.targetAmount.message}</p>
              )}
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Deadline</label>
              <input
                {...register("deadline")}
                className="w-full h-12 px-6 rounded-full bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm cursor-pointer"
                type="date"
                disabled={submittingState === "loading"}
              />
              {errors.deadline && (
                <p className="text-xs text-red-400 font-bold ml-4 mt-0.5">{errors.deadline.message}</p>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Goal Priority</label>
              <div className="relative">
                <select
                  {...register("priority")}
                  className="w-full appearance-none bg-background border border-border rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                  disabled={submittingState === "loading"}
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
              </div>
            </div>

            {/* Submit */}
            <LoadingButton
              type="submit"
              state={submittingState}
              loadingText="Initializing..."
              successText="Tersimpan!"
              className="w-full h-12 bg-primary text-primary-foreground font-bold text-xs rounded-full shadow-lg shadow-primary/10 hover:brightness-105 mt-6"
            >
              Create Goal
            </LoadingButton>
          </form>
        </div>
      ) : (
        /* Standard View: Bento Analytical Top Row + Goals Grid Bottom Row */
        <div className="space-y-8">
          
          {/* Top Row: AI Smart Allocations + Mindset Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Smart Allocation Card (2/3 width) */}
            <div className="md:col-span-2 bg-card border border-border rounded-[24px] p-6 space-y-6 shadow-xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
              <div className="absolute -right-16 -top-16 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/15 transition-all duration-500" />
              
              <div className="flex justify-between items-start border-b border-border/40 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white leading-none">Smart Allocations</h3>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mt-1.5">
                    Powered by Arthara Predictive AI
                  </span>
                </div>
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary border border-primary/20 animate-pulse">
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {/* Left Side: Cashflow Info */}
                <div className="text-left text-xs space-y-2.5 bg-background/40 p-4.5 rounded-2xl border border-border/30 flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block">Sisa Arus Kas</span>
                  <p className="text-xl font-black text-white tabular-nums leading-none">
                    Rp{netCashflow.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    AI mengalokasikan surplus bulanan Anda ke target aktif berdasarkan mindset <span className="text-primary font-bold uppercase">{financialMindset}</span> Anda.
                  </p>
                </div>

                {/* Right Side: Recommendations List */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getSmartAllocations().length === 0 ? (
                    <div className="col-span-2 flex items-center justify-center py-8">
                      <p className="text-xs text-text-secondary">
                        Belum ada target tabungan aktif. Buat target baru untuk melihat alokasi AI.
                      </p>
                    </div>
                  ) : (
                    getSmartAllocations().map((alloc) => (
                      <div key={alloc.id} className="bg-background/25 border border-border/40 p-4 rounded-2xl flex flex-col justify-between hover:border-primary/20 transition-all">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-xs font-bold text-white leading-tight truncate" title={alloc.goalName}>
                              {alloc.goalName}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-secondary/15 px-1.5 py-0.5 rounded text-text-secondary border border-border shrink-0">
                              {alloc.percentage}%
                            </span>
                          </div>
                          
                          <div className="pt-2">
                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider block">Rekomendasi</span>
                            <p className="font-extrabold text-primary text-sm tabular-nums leading-none">
                              Rp{alloc.amount.toLocaleString("id-ID")}<span className="text-[10px] font-medium text-text-secondary">/bln</span>
                            </p>
                          </div>
                        </div>

                        {alloc.estMonths !== null && (
                          <div className="pt-3.5 mt-2.5 border-t border-border/20 flex justify-between items-baseline text-[9px] text-text-secondary">
                            <span>Est. Selesai</span>
                            <span className="font-bold text-white">{alloc.estMonths} bulan</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Life Priorities Card (1/3 width) */}
            <div className="bg-card border border-border rounded-[24px] p-6 shadow-xl flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
              <div>
                <h3 className="text-lg font-bold text-white leading-none">Life Priorities</h3>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest block mt-1.5 mb-4">Bobot Mindset</span>
                <div className="space-y-3">
                  {priorities.map((p) => (
                    <div key={p.name} className="flex items-center justify-between bg-background border border-border/60 px-4 py-2.5 rounded-2xl group hover:border-primary transition-colors cursor-default">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${p.bg}`}></span>
                        <span className="text-text-secondary text-xs font-semibold group-hover:text-white transition-colors">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-white bg-secondary/20 px-2 py-0.5 rounded border border-border">
                        {p.weight}/5
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: List of Saving Target Cards (2-column layout for goals) */}
          <div className="space-y-4">
            <h3 className="text-xl font-black text-white tracking-tight">Active Savings Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => {
                const Icon = getGoalIcon(goal.name);
                const target = Number(goal.targetAmount);
                const collected = Number(goal.currentAmount);
                const percentage = target > 0 ? Math.min(Math.round((collected / target) * 100), 100) : 0;
                const deadlineStr = new Date(goal.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric"
                });

                return (
                  <div
                    key={goal.id}
                    className="bg-card border border-border rounded-[24px] p-6 flex flex-col gap-4 relative overflow-hidden hover:-translate-y-1 transition-all duration-300 ease-out shadow-lg"
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                          <FontAwesomeIcon icon={Icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white leading-none">{goal.name}</h4>
                          <p className="text-[10px] font-semibold text-text-secondary mt-1.5 uppercase tracking-wider">
                            Deadline: {deadlineStr}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold tabular-nums text-white">{percentage}%</p>
                      </div>
                    </div>

                    <div className="flex justify-between tabular-nums text-xs text-text-secondary">
                      <span>Rp{collected.toLocaleString("id-ID")} collected</span>
                      <span className="text-white font-semibold">Rp{target.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="w-full h-3 bg-background rounded-full overflow-hidden border border-border/30">
                      <div
                        className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(184,246,0,0.3)] transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {goals.length === 0 && (
              <div className="bg-card border border-border border-dashed rounded-[24px] p-12 text-center flex flex-col items-center justify-center gap-4 shadow-lg">
                <div className="w-16 h-16 bg-secondary/15 rounded-full flex items-center justify-center text-text-secondary">
                  <FontAwesomeIcon icon={faBullseye} className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white font-bold">No Goals Found</h4>
                  <p className="text-text-secondary text-xs mt-1 max-w-xs">
                    Define your savings targets and timeline to start allocation rules.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground px-6 py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer"
                >
                  Set First Goal
                </button>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
