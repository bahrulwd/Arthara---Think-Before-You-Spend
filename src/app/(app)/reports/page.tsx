"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faFaceFrown,
  faMagnifyingGlass,
  faBagShopping,
  faCoins,
  faUtensils,
  faTriangleExclamation,
  faBolt,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonReports } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";

const getTransactionIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("food") || cat.includes("makan") || cat.includes("culinary")) {
    return faUtensils;
  } else if (cat.includes("income") || cat.includes("gaji") || cat.includes("revenue")) {
    return faCoins;
  } else if (cat.includes("life") || cat.includes("shopping") || cat.includes("belanja")) {
    return faBagShopping;
  } else {
    return faBolt;
  }
};

const getTransactionIconBg = (type: string) => {
  if (type === "INCOME") return "bg-primary/20 text-primary";
  return "bg-secondary/15 text-white";
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegretOnly, setFilterRegretOnly] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [data, setData] = useState<any>({
    transactions: [],
    impulseSpending: 0,
    shareOfExpense: 0,
    triggerPercentages: { promo: 0, stress: 0, social: 0 },
    regretCount: 0,
  });

  const fetchReports = async () => {
    const startTime = Date.now();
    try {
      const res = await fetch("/api/reports");
      const resData = await res.json();
      if (res.ok) {
        setData(resData);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(1500 - elapsed, 0);
      if (remainingDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Filtering logic
  const filteredTransactions = (data.transactions || []).filter((tx: any) => {
    const desc = tx.description || "";
    const cat = tx.category || "";
    const matchesSearch =
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase());

    const isRegret = tx.moodAfter === "Regretful" || tx.moodAfter === "Guilty";

    if (filterRegretOnly) {
      return matchesSearch && isRegret;
    }
    return matchesSearch;
  });

  if (isPageLoading) {
    return <SkeletonReports />;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Impulse Pattern Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Impulse Pattern</h2>
              <span className="text-xs text-text-secondary">Last 30 days analyzed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Card 1: Impulse Spending This Month */}
              <div className="md:col-span-4 bg-card rounded-[24px] p-6 border border-border flex flex-col justify-between hover:border-border/80 transition-colors group">
                <div>
                  <p className="text-text-secondary text-xs uppercase tracking-widest font-semibold mb-4">
                    Impulse Spending This Month
                  </p>
                  <h3 className="text-3xl font-black tabular-nums text-red-500">
                    Rp{data.impulseSpending.toLocaleString("id-ID")}
                  </h3>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-text-secondary text-xs">Share of Expense: {data.shareOfExpense}%</p>
                  <FontAwesomeIcon icon={faChartLine} className="text-red-500 group-hover:translate-x-1 transition-transform w-5 h-5" />
                </div>
              </div>

              {/* Card 2: Top Triggers */}
              <div className="md:col-span-4 bg-card rounded-[24px] p-6 border border-border space-y-4">
                <p className="text-text-secondary text-xs uppercase tracking-widest font-semibold">Top Triggers</p>
                <div className="space-y-3">
                  {/* Trigger 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs px-1">
                      <span className="text-white font-medium">Promo</span>
                      <span className="text-primary font-bold">{data.triggerPercentages.promo}%</span>
                    </div>
                    <div className="h-2 w-full bg-background border border-border/30 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${data.triggerPercentages.promo}%` }}></div>
                    </div>
                  </div>
                  {/* Trigger 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs px-1">
                      <span className="text-white font-medium">Stress</span>
                      <span className="text-primary font-bold">{data.triggerPercentages.stress}%</span>
                    </div>
                    <div className="h-2 w-full bg-background border border-border/30 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${data.triggerPercentages.stress}%` }}></div>
                    </div>
                  </div>
                  {/* Trigger 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs px-1">
                      <span className="text-white font-medium">Social</span>
                      <span className="text-primary font-bold">{data.triggerPercentages.social}%</span>
                    </div>
                    <div className="h-2 w-full bg-background border border-border/30 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${data.triggerPercentages.social}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Regret Marker */}
              <div className="md:col-span-4 bg-card rounded-[24px] p-6 border border-border flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/10 rounded-xl text-primary">
                    <FontAwesomeIcon icon={faFaceFrown} className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg leading-none">Regret Marker</p>
                    <p className="text-text-secondary text-xs mt-2">{data.regretCount} transactions marked with regret.</p>
                  </div>
                </div>
                <button
                  onClick={() => setFilterRegretOnly(!filterRegretOnly)}
                  className={`mt-6 w-full py-3 rounded-full text-xs font-bold transition-all border active:scale-95 ${
                    filterRegretOnly
                      ? "bg-primary border-transparent text-primary-foreground"
                      : "bg-transparent border-border text-white hover:bg-secondary/10 hover:border-primary"
                  }`}
                >
                  {filterRegretOnly ? "Showing Regret Items" : "Review items"}
                </button>
              </div>

            </div>
          </section>

          {/* Transaction History Section */}
          <section className="space-y-4 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white">All Transactions</h2>
              <div className="relative w-full md:w-96">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-card border border-border rounded-full py-3 pl-12 pr-6 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-secondary"
                  placeholder="Filter by name, tag, or amount..."
                  type="text"
                />
              </div>
            </div>

            <div className="bg-card rounded-[24px] border border-border overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Merchant / Entity</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest text-right">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredTransactions.map((tx: any) => {
                      const Icon = getTransactionIcon(tx.category);
                      const iconBg = getTransactionIconBg(tx.type);
                      const formattedDate = new Date(tx.date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      });
                      const amount = Math.abs(Number(tx.amount));
                      const isRegret = tx.moodAfter === "Regretful" || tx.moodAfter === "Guilty";
                      const desc = tx.description || tx.category;

                      // Classifications
                      const classifications = [tx.category];
                      if (tx.behavioralTag) {
                        classifications.push(tx.behavioralTag);
                      }

                      // Check for promo
                      const isPromo = (tx.description || "").toLowerCase().includes("promo") || (tx.description || "").toLowerCase().includes("sale");

                      return (
                        <tr key={tx.id} className="hover:bg-secondary/5 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
                                <FontAwesomeIcon icon={Icon} className="w-4 h-4" />
                              </div>
                              <span className="font-semibold text-white text-sm">{desc}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-xs text-text-secondary">{formattedDate}</td>
                          <td className={`px-6 py-5 text-right font-bold tabular-nums text-sm ${tx.type === "INCOME" ? "text-primary" : "text-white"}`}>
                            {tx.type === "INCOME" ? "+" : "-"}Rp{amount.toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex gap-2 items-center flex-wrap">
                              {classifications.map((cl) => (
                                <span
                                  key={cl}
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    tx.type === "INCOME"
                                      ? "bg-primary/10 border-primary/20 text-primary"
                                      : "bg-background border-border text-text-secondary"
                                  }`}
                                >
                                  {cl}
                                </span>
                              ))}
                              {isPromo && (
                                <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                  Promo
                                </span>
                              )}
                              {isRegret && (
                                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5" />
                                  <span>Regret Flag</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-12 text-text-secondary text-xs">
                          No transactions recorded or match the active filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

    </div>
  );
}
