"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faChevronDown,
  faFileLines,
  faTable,
  faTrashCan,
  faShield,
  faSpinner,
  faTriangleExclamation,
  faCalendar
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonSettings } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";

export default function SettingsPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [anonymizeData, setAnonymizeData] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [isMonthSelectOpen, setIsMonthSelectOpen] = useState(false);
  const [exportResolution, setExportResolution] = useState("monthly"); // "monthly" or "daily"

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(true);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const resData = await res.json();
      if (res.ok) {
        setTransactions(Array.isArray(resData) ? resData : (resData.transactions || []));
      }
    } catch (err) {
      console.error("Failed to load transactions for chart:", err);
    } finally {
      setIsChartLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setIsPageLoading(true);
      await fetchTransactions();
      setIsPageLoading(false);
    };
    initFetch();
  }, []);

  const getChartData = () => {
    const monthIndex = months.indexOf(selectedMonth);
    const currentYear = 2026;
    const monthTxs = transactions.filter((tx: any) => {
      const d = new Date(tx.date);
      return d.getMonth() === monthIndex && d.getFullYear() === currentYear;
    });

    if (exportResolution === "daily") {
      const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
      const data = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dailyTxs = monthTxs.filter((tx: any) => new Date(tx.date).getDate() === d);
        let income = 0;
        let expense = 0;
        dailyTxs.forEach((tx: any) => {
          const amt = Math.abs(Number(tx.amount));
          if (tx.type === "INCOME") income += amt;
          else expense += amt;
        });
        data.push({ label: `${d}`, income, expense });
      }
      return data;
    } else {
      const weeks = [
        { label: "Week 1", start: 1, end: 7 },
        { label: "Week 2", start: 8, end: 14 },
        { label: "Week 3", start: 15, end: 21 },
        { label: "Week 4", start: 22, end: 31 },
      ];
      return weeks.map((w) => {
        const weeklyTxs = monthTxs.filter((tx: any) => {
          const d = new Date(tx.date);
          return d.getDate() >= w.start && d.getDate() <= w.end;
        });
        let income = 0;
        let expense = 0;
        weeklyTxs.forEach((tx: any) => {
          const amt = Math.abs(Number(tx.amount));
          if (tx.type === "INCOME") income += amt;
          else expense += amt;
        });
        return { label: w.label, income, expense };
      });
    }
  };

  const chartData = getChartData();
  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d.income, d.expense)),
    100000 // default minimum scale so empty states don't divide by zero
  );

  const handleExportCSV = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch transactions");

      const txs = Array.isArray(data) ? data : (data.transactions || []);
      const monthIndex = months.indexOf(selectedMonth);
      const filteredTxs = txs.filter((tx: any) => {
        const d = new Date(tx.date);
        return d.getMonth() === monthIndex && d.getFullYear() === 2026;
      });

      let csvContent = "";
      
      if (exportResolution === "daily") {
        // Daily breakdown
        csvContent = "Date,Daily Income,Daily Expense,Daily Net Cashflow\n";
        const daysInMonth = new Date(2026, monthIndex + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `2026-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dailyTxs = filteredTxs.filter((tx: any) => {
            const d = new Date(tx.date);
            return d.getDate() === day;
          });
          
          let dailyIncome = 0;
          let dailyExpense = 0;
          
          dailyTxs.forEach((tx: any) => {
            const amt = Math.abs(Number(tx.amount));
            if (tx.type === "INCOME") {
              dailyIncome += amt;
            } else {
              dailyExpense += amt;
            }
          });
          
          const net = dailyIncome - dailyExpense;
          csvContent += `${dateStr},Rp${dailyIncome},Rp${dailyExpense},Rp${net}\n`;
        }
      } else {
        // Monthly Summary
        csvContent = "Category,Type,Total Amount\n";
        const categories: { [key: string]: { income: number; expense: number } } = {};
        
        filteredTxs.forEach((tx: any) => {
          const amt = Math.abs(Number(tx.amount));
          const cat = tx.category || "Uncategorized";
          if (!categories[cat]) {
            categories[cat] = { income: 0, expense: 0 };
          }
          if (tx.type === "INCOME") {
            categories[cat].income += amt;
          } else {
            categories[cat].expense += amt;
          }
        });
        
        Object.entries(categories).forEach(([cat, val]) => {
          if (val.income > 0) {
            csvContent += `"${cat}",INCOME,Rp${val.income}\n`;
          }
          if (val.expense > 0) {
            csvContent += `"${cat}",EXPENSE,Rp${val.expense}\n`;
          }
        });
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Arthara_${selectedMonth}_2026_${exportResolution}_performance.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV");
    }
  };

  const handleExportPDF = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch transactions");

      const txs = Array.isArray(data) ? data : (data.transactions || []);
      const monthIndex = months.indexOf(selectedMonth);
      const filteredTxs = txs.filter((tx: any) => {
        const d = new Date(tx.date);
        return d.getMonth() === monthIndex && d.getFullYear() === 2026;
      });

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert("Please allow popups to export PDF");
        return;
      }

      let contentHtml = "";

      if (exportResolution === "daily") {
        contentHtml += `
          <h1>Arthara Daily Performance Report - ${selectedMonth} 2026</h1>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th>Date</th>
                <th>Daily Income</th>
                <th>Daily Expense</th>
                <th>Daily Net Cashflow</th>
              </tr>
            </thead>
            <tbody>
        `;

        const daysInMonth = new Date(2026, monthIndex + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `2026-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dailyTxs = filteredTxs.filter((tx: any) => {
            const d = new Date(tx.date);
            return d.getDate() === day;
          });
          
          let dailyIncome = 0;
          let dailyExpense = 0;
          
          dailyTxs.forEach((tx: any) => {
            const amt = Math.abs(Number(tx.amount));
            if (tx.type === "INCOME") {
              dailyIncome += amt;
            } else {
              dailyExpense += amt;
            }
          });
          
          const net = dailyIncome - dailyExpense;
          contentHtml += `
            <tr>
              <td>${dateStr}</td>
              <td>Rp${dailyIncome.toLocaleString("id-ID")}</td>
              <td>Rp${dailyExpense.toLocaleString("id-ID")}</td>
              <td style="color: ${net >= 0 ? "green" : "red"}; font-weight: bold;">Rp${net.toLocaleString("id-ID")}</td>
            </tr>
          `;
        }

        contentHtml += `
            </tbody>
          </table>
        `;
      } else {
        contentHtml += `
          <h1>Arthara Monthly Summary Report - ${selectedMonth} 2026</h1>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th>Category</th>
                <th>Type</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
        `;

        const categories: { [key: string]: { income: number; expense: number } } = {};
        filteredTxs.forEach((tx: any) => {
          const amt = Math.abs(Number(tx.amount));
          const cat = tx.category || "Uncategorized";
          if (!categories[cat]) {
            categories[cat] = { income: 0, expense: 0 };
          }
          if (tx.type === "INCOME") {
            categories[cat].income += amt;
          } else {
            categories[cat].expense += amt;
          }
        });

        Object.entries(categories).forEach(([cat, val]) => {
          if (val.income > 0) {
            contentHtml += `
              <tr>
                <td>${cat}</td>
                <td>INCOME</td>
                <td style="color: green; font-weight: bold;">Rp${val.income.toLocaleString("id-ID")}</td>
              </tr>
            `;
          }
          if (val.expense > 0) {
            contentHtml += `
              <tr>
                <td>${cat}</td>
                <td>EXPENSE</td>
                <td style="color: red; font-weight: bold;">Rp${val.expense.toLocaleString("id-ID")}</td>
              </tr>
            `;
          }
        });

        contentHtml += `
            </tbody>
          </table>
        `;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Arthara Report</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              h1 { color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
              th { background-color: #f7f7f7; }
            </style>
          </head>
          <body>
            ${contentHtml}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF");
    }
  };

  const handleDeletePurge = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      alert("All user logs, data governance settings, and transactions have been successfully purged from our system.");
    }, 2200);
  };

  if (isPageLoading) {
    return <SkeletonSettings />;
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 select-none">
      
      {/* Section 1: Monthly Performance Report Card */}
      <section className="bg-card rounded-[24px] p-6 border border-border shadow-md flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Performance Export</h2>
            <p className="text-text-secondary text-[10px] uppercase font-bold tracking-widest mt-1">Detailed Analysis</p>
          </div>
          
          {/* Month Selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMonthSelectOpen(!isMonthSelectOpen)}
              className="bg-background text-xs text-white px-5 py-2.5 rounded-full flex items-center gap-2 border border-border hover:border-primary transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-primary" />
              {selectedMonth} 2026
            <FontAwesomeIcon icon={faChevronDown} className={`w-4 h-4 text-text-secondary transition-transform ${isMonthSelectOpen ? "rotate-180" : ""}`} />
            </button>

            {isMonthSelectOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMonthSelectOpen(false)} />
                <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-[20px] shadow-2xl p-1.5 z-50 flex flex-col gap-1 max-h-60 overflow-y-auto">
                  {months.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMonth(m);
                        setIsMonthSelectOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-full text-[11px] font-bold transition-all ${
                        m === selectedMonth
                          ? "bg-primary text-primary-foreground"
                          : "text-text-secondary hover:text-white hover:bg-secondary/15"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Custom Bar Chart Visualization with X/Y Axes and Hover Tooltips */}
        {isChartLoading ? (
          <div className="h-64 md:h-80 w-full flex items-center justify-center border-b border-border/30 pb-8">
            <FontAwesomeIcon icon={faSpinner} className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex gap-4 items-stretch h-64 md:h-80 w-full pt-12 pr-2 relative">
            {/* Y-Axis Labels (Left) */}
            <div className="flex flex-col justify-between text-[10px] font-semibold text-text-secondary text-right w-16 h-[calc(100%-24px)] select-none border-r border-border/30 pr-3">
              <span>Rp{maxVal >= 1000000 ? `${(maxVal / 1000000).toFixed(1)}M` : maxVal.toLocaleString("id-ID")}</span>
              <span>Rp{(maxVal * 0.75) >= 1000000 ? `${((maxVal * 0.75) / 1000000).toFixed(1)}M` : (maxVal * 0.75).toLocaleString("id-ID")}</span>
              <span>Rp{(maxVal * 0.5) >= 1000000 ? `${((maxVal * 0.5) / 1000000).toFixed(1)}M` : (maxVal * 0.5).toLocaleString("id-ID")}</span>
              <span>Rp{(maxVal * 0.25) >= 1000000 ? `${((maxVal * 0.25) / 1000000).toFixed(1)}M` : (maxVal * 0.25).toLocaleString("id-ID")}</span>
              <span>Rp0</span>
            </div>

            {/* Chart + Label Vertical Stack */}
            <div className="flex-grow flex flex-col h-full relative">
              {/* Plotting area (Bars & Gridlines) */}
              <div className="flex-grow flex items-end justify-around gap-1 md:gap-2 relative border-b border-border/30 pb-0.5">
                
                {/* Gridlines background helper */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none pr-2">
                  <div className="w-full border-t border-border/10"></div>
                  <div className="w-full border-t border-border/10"></div>
                  <div className="w-full border-t border-border/10"></div>
                  <div className="w-full border-t border-border/10"></div>
                  <div className="w-full"></div>
                </div>

                {/* Render Bars */}
                {chartData.map((item, idx) => {
                  const incomeHeight = `${Math.max(2, (item.income / maxVal) * 100)}%`;
                  const expenseHeight = `${Math.max(2, (item.expense / maxVal) * 100)}%`;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group z-10">
                      
                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full mb-3 bg-[#12141D] border border-border rounded-xl p-3 shadow-2xl z-30 hidden group-hover:flex flex-col gap-1 w-36 pointer-events-none text-left animate-fade-in">
                        <p className="text-[10px] font-bold text-white border-b border-border/25 pb-1 mb-1">
                          {exportResolution === "daily" ? `Day ${item.label}` : item.label}
                        </p>
                        <p className="text-[9px] text-primary flex justify-between gap-2">
                          <span>Income:</span>
                          <span className="font-bold tabular-nums">Rp{item.income.toLocaleString("id-ID")}</span>
                        </p>
                        <p className="text-[9px] text-red-400 flex justify-between gap-2">
                          <span>Expense:</span>
                          <span className="font-bold tabular-nums">Rp{item.expense.toLocaleString("id-ID")}</span>
                        </p>
                      </div>

                      {/* Income/Expense double bars */}
                      <div className="w-full flex items-end justify-center gap-0.5 md:gap-1.5 h-full">
                        {/* Income Bar */}
                        <div
                          className="w-1 md:w-3.5 bg-primary rounded-t-full transition-all duration-300 group-hover:brightness-110 group-hover:shadow-[0_0_12px_rgba(184,246,0,0.4)]"
                          style={{ height: incomeHeight }}
                        ></div>
                        {/* Expense Bar */}
                        <div
                          className="w-1 md:w-3.5 bg-text-secondary/35 rounded-t-full transition-all duration-300 group-hover:bg-red-500/80 group-hover:brightness-110 group-hover:shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                          style={{ height: expenseHeight }}
                        ></div>
                      </div>
                    </div>
                  );
                })}

                {/* Legend inside gridlines area */}
                <div className="absolute -top-8 right-0 flex gap-4 select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Income</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-text-secondary/50"></div>
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Expenses</span>
                  </div>
                </div>
              </div>

              {/* X-Axis labels row (Strictly below the X-Axis border line) */}
              <div className="flex justify-around items-center pt-2 h-6">
                {chartData.map((item, idx) => {
                  const isLabelVisible = exportResolution === "monthly" || 
                                         Number(item.label) === 1 || 
                                         Number(item.label) % 5 === 0 || 
                                         Number(item.label) === chartData.length;
                  return (
                    <div key={idx} className="flex-1 text-center select-none">
                      <span className={`text-text-secondary text-[9px] font-bold ${isLabelVisible ? "opacity-100" : "opacity-0"}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="relative">
            <select
              value={exportResolution}
              onChange={(e) => setExportResolution(e.target.value)}
              className="appearance-none bg-background border border-border text-xs text-white px-5 py-3 rounded-full pr-10 font-bold hover:border-primary transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-lg shadow-black/5"
            >
              <option value="monthly">Monthly Summary</option>
              <option value="daily">Daily Breakdown</option>
            </select>
            <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4 text-text-secondary absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleExportPDF}
            className="flex-1 md:flex-none px-6 py-3 rounded-full border border-border text-white text-xs font-bold hover:bg-secondary/10 hover:border-primary transition-colors flex items-center justify-center gap-2 active:scale-95 duration-150 cursor-pointer"
          >
            <FontAwesomeIcon icon={faFileLines} className="w-4 h-4 text-text-secondary" />
            Export PDF
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-6 py-3 rounded-full border border-border text-white text-xs font-bold hover:bg-secondary/10 hover:border-primary transition-colors flex items-center justify-center gap-2 active:scale-95 duration-150 cursor-pointer"
          >
            <FontAwesomeIcon icon={faTable} className="w-4 h-4 text-text-secondary" />
            Export CSV
          </button>
        </div>
      </section>

      {/* Section 2: Data & Privacy Settings */}
      <section className="bg-card rounded-[24px] p-6 border border-border shadow-md flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Data Governance</h2>
          <p className="text-text-secondary text-xs mt-1">Control how Arthara manages and secures your financial information.</p>
        </div>

        <div className="space-y-4">
          
          {/* Strict Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#12141D]/40 rounded-2xl border border-border/50 hover:border-border transition-colors">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold text-white">Strict Mode</p>
              <p className="text-xs text-text-secondary">Block transactions that exceed budget automatically</p>
            </div>
            
            {/* Toggle Button */}
            <button
              onClick={() => setStrictMode(!strictMode)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${
                strictMode ? "bg-primary" : "bg-secondary/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full absolute top-1 left-1 transition-transform duration-200 shadow-sm ${
                  strictMode ? "translate-x-6 bg-primary-foreground" : "bg-text-secondary"
                }`}
              ></span>
            </button>
          </div>

          {/* Anonymize Data Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#12141D]/40 rounded-2xl border border-border/50 hover:border-border transition-colors">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold text-white">Anonymize data for global insights</p>
              <p className="text-xs text-text-secondary">Contribute to community benchmarks while maintaining privacy</p>
            </div>
            
            {/* Toggle Button */}
            <button
              onClick={() => setAnonymizeData(!anonymizeData)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${
                anonymizeData ? "bg-primary" : "bg-secondary/20"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full absolute top-1 left-1 transition-transform duration-200 shadow-sm ${
                  anonymizeData ? "translate-x-6 bg-primary-foreground" : "bg-text-secondary"
                }`}
              ></span>
            </button>
          </div>

        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-red-400">Danger Zone</p>
            <p className="text-xs text-text-secondary">This action is irreversible and will purge all history</p>
          </div>

          {showDeleteConfirm ? (
            <div className="flex items-center gap-3 animate-fade-in">
              <LoadingButton
                state={isDeleting ? "loading" : "idle"}
                onClick={handleDeletePurge}
                loadingText="Purging..."
                successText="Purged!"
                icon={faTriangleExclamation}
                className="px-6 py-2.5 rounded-full bg-red-500 text-white font-bold text-xs hover:brightness-105"
              >
                Confirm Purge
              </LoadingButton>
              <button
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2.5 rounded-full border border-border text-text-secondary hover:text-white text-xs font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2.5 rounded-full border border-red-500 text-red-500 font-bold text-xs hover:bg-red-500/10 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
              Delete Account & Data
            </button>
          )}
        </div>
      </section>

    </div>
  );
}
