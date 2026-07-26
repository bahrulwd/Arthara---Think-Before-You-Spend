"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faEllipsis,
  faBagShopping,
  faMugSaucer,
  faBolt,
  faArrowRight,
  faTriangleExclamation,
  faRocket,
  faChartArea,
  faCircleCheck,
  faDroplet,
  faXmark,
  faLightbulb,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonDashboard } from "@/components/ui/skeletons";

const getTransactionIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("makan")) {
    return faMugSaucer;
  } else if (cat.includes("life") || cat.includes("gaya")) {
    return faBagShopping;
  } else {
    return faBolt;
  }
};

export default function DashboardPage() {
  const [data, setData] = useState<{
    netCashflow: number;
    income: number;
    expense: number;
    healthScore: number | null;
    budgets: any[];
    recentTransactions: any[];
    latestLeak: any | null;
    latestGoal: any | null;
  }>({
    netCashflow: 0,
    income: 0,
    expense: 0,
    healthScore: null,
    budgets: [],
    recentTransactions: [],
    latestLeak: null,
    latestGoal: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [animatedCashflow, setAnimatedCashflow] = useState(0);
  const [showLeakModal, setShowLeakModal] = useState(false);
  const [isResolvingLeak, setIsResolvingLeak] = useState(false);

  const handleResolveLeak = async (leakId: string) => {
    try {
      setIsResolvingLeak(true);
      const res = await fetch("/api/money-leaks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leakId, isResolved: true }),
      });
      if (res.ok) {
        await loadDashboard();
        setShowLeakModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsResolvingLeak(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const startTime = Date.now();
      await fetch("/api/init");
      const res = await fetch("/api/dashboard");
      const resData = await res.json();
      
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(1500 - elapsed, 0);
      if (remainingDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }

      setData({
        netCashflow: resData.netCashflow || 0,
        income: resData.income || 0,
        expense: resData.expense || 0,
        healthScore: resData.healthScore !== undefined ? resData.healthScore : null,
        budgets: resData.budgets || [],
        recentTransactions: resData.recentTransactions || [],
        latestLeak: resData.latestLeak || null,
        latestGoal: resData.latestGoal || null,
      });
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let start = 0;
    const end = data.netCashflow;
    const duration = 1200;
    const startTime = performance.now();
    let animationFrameId: number;

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const currentValue = Math.floor(easedProgress * end);
      setAnimatedCashflow(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(update);
      }
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoading, data.netCashflow]);

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Bento Grid Top Row (KPIs) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Net Cashflow Card */}
        <div className="col-span-12 lg:col-span-4 bg-card rounded-[24px] p-6 border border-border flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold">Net Cashflow</span>
              <FontAwesomeIcon icon={faChartLine} className="text-primary w-5 h-5" />
            </div>
            <h3 className="text-3xl font-black tabular-nums text-primary">
              {animatedCashflow >= 0 ? "+" : "-"}Rp{Math.abs(animatedCashflow).toLocaleString("id-ID")}
            </h3>
            <p className="text-text-secondary text-xs mt-1">Available to invest this month</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-background/40 rounded-xl p-3 border border-border/30">
              <p className="text-[10px] uppercase text-text-secondary mb-1">Income</p>
              <p className="font-bold text-sm tabular-nums text-white">Rp{data.income.toLocaleString("id-ID")}</p>
            </div>
            <div className="bg-background/40 rounded-xl p-3 border border-border/30">
              <p className="text-[10px] uppercase text-text-secondary mb-1">Expense</p>
              <p className="font-bold text-sm tabular-nums text-white">Rp{data.expense.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>

        {/* Health Score Card */}
        <div className="col-span-12 lg:col-span-4 bg-card rounded-[24px] p-6 border border-border relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 ease-out">
          <div className="relative z-10">
            <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold block mb-4">Health Score</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black tabular-nums text-primary">{data.healthScore !== null ? data.healthScore : "—"}</h3>
              <span className="text-text-secondary text-lg">/100</span>
            </div>
            {data.healthScore !== null ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mt-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {data.healthScore >= 70 ? "Healthy" : data.healthScore >= 40 ? "Stable" : "Warning"}
                </div>
                <p className="text-text-secondary text-xs mt-6 leading-relaxed">
                  {data.healthScore >= 70 
                    ? "Your financial resilience is excellent. You are keeping expenses well within check."
                    : "Your financial resilience is stable, but consider reducing some impulsive purchases."}
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary/20 text-text-secondary rounded-full text-xs font-bold mt-3">
                  <span className="w-2 h-2 rounded-full bg-text-secondary/40"></span>
                  No Data
                </div>
                <p className="text-text-secondary text-xs mt-6 leading-relaxed">
                  Please add your first transaction to calculate your financial health score automatically.
                </p>
              </>
            )}
          </div>
          {/* Ambient light glow */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
        </div>

        {/* Budget Tracking Card */}
        <div className="col-span-12 lg:col-span-4 bg-card rounded-[24px] p-6 border border-border hover:-translate-y-1 transition-transform duration-300 ease-out">
          <div className="flex justify-between items-center mb-6">
            <span className="text-text-secondary text-xs uppercase tracking-widest font-semibold">Budget Tracking</span>
            <FontAwesomeIcon icon={faEllipsis} className="text-text-secondary w-5 h-5 cursor-pointer" />
          </div>
          <div className="space-y-4">
            {data.budgets.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-text-secondary mb-3">No budgets set yet.</p>
                <Link href="/budgets" className="text-xs font-bold text-primary hover:underline">Set Budget Now &rarr;</Link>
              </div>
            ) : (
              data.budgets.map((b) => {
                const percentage = Math.min(Math.round((b.spent / b.limit) * 100), 100);
                return (
                  <div key={b.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-white">{b.category}</span>
                      <span className="text-xs font-bold tabular-nums text-text-secondary">{percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border/30">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          b.status === "CRITICAL" 
                            ? "bg-red-500" 
                            : b.status === "WARNING" 
                            ? "bg-amber-500" 
                            : "bg-primary"
                        }`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Bento Grid Bottom Row (Transactions / Insights) */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Recent Transactions Card (White Theme) */}
        <div className="col-span-12 lg:col-span-7 bg-white text-neutral-900 rounded-[32px] p-8 shadow-2xl hover:-translate-y-1 transition-transform duration-300 ease-out">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-black tracking-tight text-neutral-950">Recent Transactions</h4>
            <Link 
              href="/transactions" 
              className="text-neutral-500 hover:text-neutral-950 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              View All <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {data.recentTransactions.length === 0 ? (
              <p className="text-neutral-500 text-xs py-8 text-center font-medium">No transactions recorded yet.</p>
            ) : (
              data.recentTransactions.map((tx) => {
                const Icon = getTransactionIcon(tx.category);
                const isExpense = tx.type === "EXPENSE";
                const amountSign = isExpense ? "-" : "+";
                
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-[20px] hover:bg-neutral-50 transition-colors group border-b border-neutral-100/50 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-200">
                        <FontAwesomeIcon icon={Icon} className="text-neutral-800 w-5 h-5 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-neutral-900">{tx.description || "Transaction"}</p>
                        <div className="flex gap-1.5 mt-1.5">
                          {tx.behavioralTag && (
                            <span className="px-2.5 py-0.5 bg-[#12141D] text-white text-[9px] rounded-full font-bold uppercase tracking-wider">
                              {tx.behavioralTag}
                            </span>
                          )}
                          {tx.moodBefore && (
                            <span className="px-2.5 py-0.5 bg-neutral-200 text-neutral-600 text-[9px] rounded-full font-bold uppercase tracking-wider">
                              {tx.moodBefore}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-neutral-900 tabular-nums">
                        {amountSign}Rp{Number(tx.amount).toLocaleString("id-ID")}
                      </p>
                      <p className="text-neutral-400 text-[10px] mt-0.5">
                        {new Date(tx.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Money Leak Card & Goal Progress wrapper */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          
          {/* Money Leak Card */}
          <div className="bg-card rounded-[32px] p-8 border border-border flex-1 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 ease-out">
            {data.latestLeak ? (
              <div>
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Money Leak Identified</h4>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  You&apos;ve spent <span className="text-white font-bold">Rp{Number(data.latestLeak.monthlyCost).toLocaleString("id-ID")}</span> on <span className="text-white font-bold">{data.latestLeak.sourceName}</span> this month. This is classified as a <span className="text-red-400 font-bold">{data.latestLeak.leakType.replace("_", " ")}</span>.
                </p>
                <div className="p-4 bg-background/50 rounded-2xl border border-border/50">
                  <p className="text-xs italic text-text-secondary">
                    Mitigation Plan: &ldquo;{data.latestLeak.mitigationPlan}&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-green-400 w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">No Leaks Detected</h4>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                  Excellent job! We haven&apos;t identified any inactive subscriptions or behavioral money leaks in your profile. Keep it up!
                </p>
              </div>
            )}
            
            <button
              onClick={() => setShowLeakModal(true)}
              className="w-full py-4 mt-8 bg-secondary/15 hover:bg-primary hover:text-primary-foreground text-white text-xs font-bold rounded-full transition-all duration-200 flex items-center justify-center gap-2 border border-border/40 hover:border-transparent text-center cursor-pointer active:scale-95"
            >
              <span>Analyze Details</span>
              <FontAwesomeIcon icon={faChartArea} className="w-4 h-4" />
            </button>
          </div>

          {/* Goal Progress Card */}
          {data.latestGoal ? (
            <div className="bg-primary text-primary-foreground rounded-[24px] p-6 flex items-center justify-between shadow-lg shadow-primary/10 hover:-translate-y-1 transition-transform duration-300 ease-out">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRocket} className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-xs text-primary-foreground/60 uppercase tracking-wider">Goal Progress</p>
                  <p className="font-black text-sm text-primary-foreground">{data.latestGoal.name}</p>
                </div>
              </div>
              <div className="text-right">
                {(() => {
                  const current = Number(data.latestGoal.currentAmount);
                  const target = Number(data.latestGoal.targetAmount);
                  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;
                  return (
                    <>
                      <p className="font-black text-xl text-primary-foreground">{percentage}%</p>
                      <div className="h-1 w-20 bg-primary-foreground/20 rounded-full mt-1.5">
                        <div className="h-full bg-primary-foreground rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border text-white rounded-[24px] p-6 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300 ease-out">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRocket} className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <p className="font-bold text-xs text-text-secondary uppercase tracking-wider">Goal Progress</p>
                  <p className="font-bold text-sm text-white">No active goals</p>
                </div>
              </div>
              <Link href="/goals" className="text-xs font-bold text-primary hover:underline">
                Set Goal Now &rarr;
              </Link>
            </div>
          )}

        </div>

      </div>

      {/* ── Money Leak Details Modal ── */}
      {showLeakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border rounded-[32px] max-w-lg w-full p-6 md:p-8 space-y-6 relative shadow-2xl overflow-hidden text-left">
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <FontAwesomeIcon icon={faDroplet} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">Money Leak Analysis</h3>
                  <p className="text-xs text-text-secondary">Detailed behavioral breakdown & impact</p>
                </div>
              </div>
              <button
                onClick={() => setShowLeakModal(false)}
                className="w-8 h-8 rounded-full bg-secondary/20 hover:bg-secondary/40 text-text-secondary hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            {data.latestLeak ? (
              <div className="space-y-5">
                <div className="bg-background/60 border border-border/60 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                        {data.latestLeak.leakType.replace("_", " ")}
                      </span>
                      <h4 className="text-xl font-black text-white mt-2.5">{data.latestLeak.sourceName}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/40">
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Estimated Monthly Cost</p>
                      <p className="text-xl font-black text-red-400 tabular-nums">
                        Rp{Number(data.latestLeak.monthlyCost).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Annual Leak Impact</p>
                      <p className="text-xl font-black text-amber-400 tabular-nums">
                        Rp{(Number(data.latestLeak.monthlyCost) * 12).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <FontAwesomeIcon icon={faLightbulb} className="w-3.5 h-3.5" />
                    <span>Recommended Mitigation Plan</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed italic">
                    &ldquo;{data.latestLeak.mitigationPlan}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => handleResolveLeak(data.latestLeak.id)}
                    disabled={isResolvingLeak}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-xs pill-shadow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isResolvingLeak ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin" />
                        <span>Plugging Leak...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
                        <span>Plug This Leak (Mark Resolved)</span>
                      </>
                    )}
                  </button>
                  <Link
                    href="/money-leak"
                    onClick={() => setShowLeakModal(false)}
                    className="w-full py-3 bg-secondary/15 hover:bg-secondary/30 text-white font-bold rounded-full text-xs transition-colors flex items-center justify-center gap-2 border border-border/50 text-center"
                  >
                    <span>View Full Money Leak Map</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
                  <FontAwesomeIcon icon={faCircleCheck} className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">No Active Money Leaks</h4>
                <p className="text-xs text-text-secondary max-w-xs mx-auto leading-relaxed">
                  All identified money leaks have been plugged! Your cashflow is protected.
                </p>
                <Link
                  href="/money-leak"
                  onClick={() => setShowLeakModal(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full text-xs"
                >
                  <span>Go to Money Leak Map</span>
                  <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

