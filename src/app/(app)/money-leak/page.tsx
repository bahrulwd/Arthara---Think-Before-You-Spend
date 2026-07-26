import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faCircleInfo,
  faCookie,
  faLandmark,
  faCartShopping,
  faArrowTrendDown,
  faLightbulb,
  faCheck,
  faRocket,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonMoneyLeak } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";

export default function MoneyLeakPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [autoPlugEnabled, setAutoPlugEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<"idle" | "loading" | "success">("idle");
  const [dbLeaks, setDbLeaks] = useState<any[]>([]);

  const fetchLeaks = async () => {
    try {
      const res = await fetch("/api/money-leaks");
      if (res.ok) {
        const data = await res.json();
        setDbLeaks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaks();
  }, []);

  const handleResolveLeak = async (id: string, targetResolved: boolean) => {
    try {
      const res = await fetch("/api/money-leaks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isResolved: targetResolved }),
      });
      if (res.ok) {
        await fetchLeaks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAutoPlug = async (target: boolean) => {
    setIsSubmitting("loading");
    setTimeout(() => {
      setIsSubmitting("success");
      setTimeout(() => {
        setAutoPlugEnabled(target);
        setIsSubmitting("idle");
      }, 1200);
    }, 1800);
  };

  if (isPageLoading) {
    return <SkeletonMoneyLeak />;
  }

  const activeDbLeaks = dbLeaks.filter((l) => !l.isResolved);
  const activeDbTotal = activeDbLeaks.reduce((sum, item) => sum + Number(item.monthlyCost), 0);
  const totalLeakMonthly = 420000 + activeDbTotal;
  const totalLeakAnnual = totalLeakMonthly * 12;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* Header Section */}
      <section className="space-y-1.5">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faDroplet} className="text-primary w-8 h-8" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Money Leak Map</h1>
        </div>
        <p className="text-text-secondary text-sm">Track micro-spending and recurring hidden costs.</p>
      </section>

      {/* Top Highlight Card */}
      <div className="bg-card border border-border rounded-[24px] p-6 md:p-8 relative overflow-hidden group hover:border-primary/20 transition-all duration-300">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Total Estimated Leak This Month</p>
            <h2 className="text-5xl font-black tabular-nums text-amber-500">
              Rp{totalLeakMonthly.toLocaleString("id-ID")}
            </h2>
            <div className="flex items-center gap-2 text-primary">
              <FontAwesomeIcon icon={faCircleInfo} className="w-4 h-4 shrink-0" />
              <p className="text-xs font-medium">You could have added this to your Emergency Fund.</p>
            </div>
          </div>
          <div className="bg-background/40 p-6 rounded-2xl border border-border/50 max-w-[320px] w-full">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Potential Savings (Annual)</p>
              <p className="text-xl font-bold text-white">Rp{totalLeakAnnual.toLocaleString("id-ID")}</p>
              <div className="mt-4 w-full h-2 bg-border/40 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Identified DB Leaks Section */}
      {dbLeaks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Detected Account Leaks</span>
            <span className="text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full">
              {activeDbLeaks.length} Active
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dbLeaks.map((leak) => (
              <div
                key={leak.id}
                className={`bg-card border rounded-[24px] p-6 flex flex-col justify-between transition-all duration-300 ${
                  leak.isResolved
                    ? "border-green-500/30 bg-green-500/[0.02]"
                    : "border-red-500/30 hover:border-red-500/50"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        leak.isResolved
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {leak.isResolved ? "PLUGGED" : leak.leakType.replace("_", " ")}
                    </span>
                    <p className="text-xl font-black text-amber-500 tabular-nums">
                      Rp{Number(leak.monthlyCost).toLocaleString("id-ID")}/mo
                    </p>
                  </div>
                  <h4 className="text-lg font-bold text-white">{leak.sourceName}</h4>
                  <p className="text-xs text-text-secondary italic bg-background/50 p-3 rounded-xl border border-border/40">
                    &ldquo;{leak.mitigationPlan}&rdquo;
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-border/40 flex justify-between items-center">
                  <span className="text-xs text-text-secondary">
                    Status: <strong className={leak.isResolved ? "text-green-400" : "text-red-400"}>{leak.isResolved ? "Resolved" : "Active Leak"}</strong>
                  </span>
                  <button
                    onClick={() => handleResolveLeak(leak.id, !leak.isResolved)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      leak.isResolved
                        ? "bg-secondary/20 text-white hover:bg-secondary/40"
                        : "bg-primary text-primary-foreground hover:brightness-110 pill-shadow"
                    }`}
                  >
                    {leak.isResolved ? "Re-open Leak" : "Plug Leak Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bento Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Small Snacks */}
        <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col justify-between hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 ease-out">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-background border border-border rounded-xl">
                <FontAwesomeIcon icon={faCookie} className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">High Frequency</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Small Snacks</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-6">14x transactions under Rp20.000</p>
            
            {/* Custom rounded pill bar chart */}
            <div className="flex items-end gap-1.5 h-12 mb-6">
              <div className="w-full bg-primary/45 rounded-full" style={{ height: "40%" }}></div>
              <div className="w-full bg-primary/60 rounded-full" style={{ height: "60%" }}></div>
              <div className="w-full bg-primary/30 rounded-full" style={{ height: "30%" }}></div>
              <div className="w-full bg-primary rounded-full shadow-[0_0_10px_rgba(184,246,0,0.2)]" style={{ height: "90%" }}></div>
              <div className="w-full bg-primary/50 rounded-full" style={{ height: "50%" }}></div>
              <div className="w-full bg-primary/75 rounded-full" style={{ height: "70%" }}></div>
              <div className="w-full bg-primary rounded-full shadow-[0_0_12px_rgba(184,246,0,0.3)]" style={{ height: "100%" }}></div>
            </div>
          </div>
          <p className="text-2xl font-black text-amber-500 tabular-nums">Rp175.000</p>
        </div>

        {/* Card 2: Admin Fees */}
        <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col justify-between hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 ease-out">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-background border border-border rounded-xl">
                <FontAwesomeIcon icon={faLandmark} className="w-5 h-5 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Recurring Leak</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Admin Fees</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-6">7 recurring transfer/top-up fees</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center pb-2 border-b border-border/30">
                <span className="text-xs text-text-secondary">E-Wallet Topup</span>
                <span className="text-xs text-white font-bold tabular-nums">Rp1.500 x 5</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border/30">
                <span className="text-xs text-text-secondary">Interbank Trf</span>
                <span className="text-xs text-white font-bold tabular-nums">Rp6.500 x 2</span>
              </div>
            </div>
          </div>
          <p className="text-2xl font-black text-amber-500 tabular-nums">Rp35.000</p>
        </div>

        {/* Card 3: Promo Spending */}
        <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col justify-between hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 ease-out">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-2.5 bg-background border border-border rounded-xl">
                <FontAwesomeIcon icon={faCartShopping} className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                Impulse
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Promo Spending</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-6">3 low-priority purchases triggered by discounts</p>
            
            <div className="relative h-20 w-full rounded-xl overflow-hidden bg-background border border-border/50">
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA79B0GQa4HKTlk7YQc7vV2cFMbhesih1tC19I81FjPjML0nv17l6P-yhH350egDSW4-raknB_eBce1TuFNLfmOoHTfV5HuFayN6EcSdd3t2kuU6IxN-35tqRctkrG440MsDdmGebCm3UEjWtfma_J0FZ_RDOkKHZubqMBVQvxjNzrqrYZg7gL5KNTahlgB1SrP-VjqY43zABHRwTkx5IxLVRLQajHubwv0Y0foiQI-Vlh4KcrWHkny4u5QRM5lOQXJLaHgqpJhVn8')` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FontAwesomeIcon icon={faArrowTrendDown} className="text-primary w-8 h-8 drop-shadow-[0_0_6px_#BFFF00]" />
              </div>
            </div>
          </div>
          <p className="text-2xl font-black text-amber-500 tabular-nums">Rp210.000</p>
        </div>

      </div>

      {/* Action / Projections Footer panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        
        {/* Smart Fixes List */}
        <div className="bg-card border border-border rounded-[24px] p-6 hover:border-primary/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon icon={faLightbulb} className="text-primary w-6 h-6" />
            <h3 className="text-lg font-bold text-white">Smart Fixes</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Switch to a zero-fee digital bank for transfers to save <span className="text-white font-bold">Rp35.000</span>/mo.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                <FontAwesomeIcon icon={faCheck} className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Set a &apos;Cooling Off&apos; timer for 24h on all promo-driven purchases.
              </p>
            </li>
          </ul>
        </div>

        {/* Plug the Leaks Call to Action */}
        <div className="bg-primary rounded-[24px] p-6 flex flex-col items-center justify-center text-center text-primary-foreground shadow-lg shadow-primary/10 min-h-[220px]">
          {autoPlugEnabled ? (
            <div className="space-y-4 py-4 animate-fade-in w-full flex flex-col items-center">
              <FontAwesomeIcon icon={faCircleCheck} className="w-12 h-12 text-primary-foreground animate-bounce" />
              <h3 className="text-lg font-black tracking-tight leading-none text-primary-foreground">Auto-Plug Active!</h3>
              <p className="text-xs font-semibold opacity-90 max-w-[280px] leading-relaxed mx-auto">
                Successfully redirected <span className="underline">Rp420.000/month</span> of micro-spends to your Emergency Fund!
              </p>
              <LoadingButton
                type="button"
                state={isSubmitting}
                onClick={() => handleToggleAutoPlug(false)}
                loadingText="Disabling..."
                successText="Disabled!"
                className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground opacity-60 hover:opacity-100 transition-opacity bg-transparent"
              >
                Disable Auto-Plug
              </LoadingButton>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <FontAwesomeIcon icon={faRocket} className="w-12 h-12 mb-3 text-primary-foreground" />
              <h3 className="text-lg font-black tracking-tight leading-none text-primary-foreground">Plug the Leaks</h3>
              <p className="text-xs font-medium mb-6 opacity-80 max-w-[260px] leading-relaxed">
                Automate your savings with the detected &apos;leak&apos; amount.
              </p>
              <LoadingButton
                type="button"
                state={isSubmitting}
                onClick={() => handleToggleAutoPlug(true)}
                loadingText="Redirecting..."
                successText="Enabled!"
                className="bg-primary-foreground text-primary px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest"
              >
                Enable Auto-Plug
              </LoadingButton>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
