"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTag,
  faFaceFrown,
  faHeartPulse,
  faTriangleExclamation,
  faArrowTrendDown,
  faClock,
  faSpinner,
  faCircleCheck,
  faCircleXmark,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonPreSpending } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";

// Form Validation Schema
const simulatorSchema = z.object({
  itemName: z.string().min(2, "Item name must be at least 2 characters"),
  amount: z.string().refine((val) => !isNaN(Number(val.replace(/\./g, ""))) && Number(val.replace(/\./g, "")) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, "Please select a category"),
  isWant: z.boolean(),
  isPromo: z.boolean(),
  isLowMood: z.boolean(),
});

type SimulatorValues = z.infer<typeof simulatorSchema>;

export default function PreSpendingCheckPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [submittingState, setSubmittingState] = useState<"idle" | "loading" | "success">("idle");
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [outcome, setOutcome] = useState<"NONE" | "CANCELLED" | "PROCEEDED">("NONE");

  // Output projection results
  const [projections, setProjections] = useState({
    originalPercent: 76,
    newPercent: 93,
    savingRateOld: 18,
    savingRateNew: 10,
    delayDays: 11,
    savedAmount: 0,
  });

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SimulatorValues>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      itemName: "New Sneakers",
      amount: "750.000",
      category: "Lifestyle",
      isWant: true,
      isPromo: true,
      isLowMood: true,
    },
  });

  const watchWant = watch("isWant");
  const watchPromo = watch("isPromo");
  const watchLowMood = watch("isLowMood");

  // Page mount loader simulation
  useState(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1500);
    return () => clearTimeout(timer);
  });

  // Run the analysis and update metrics dynamically
  const handleAnalyze = (data: SimulatorValues) => {
    setSubmittingState("loading");
    setOutcome("NONE");
    
    // Convert string Rp amount to number
    const numericAmount = Number(data.amount.replace(/\./g, ""));

    setTimeout(() => {
      setSubmittingState("success");
      setTimeout(() => setSubmittingState("idle"), 1200);
      setAnalysisCompleted(true);

      // Perform a mock/calculated scaling based on purchase size
      const limitMultiplier = 4000000; // Mock category limit
      const percentageAdded = Math.min(Math.round((numericAmount / limitMultiplier) * 100), 24);
      const calculatedNewPercent = 76 + percentageAdded;
      const savingRateImpact = Math.max(18 - Math.round((numericAmount / 100000) * 1), 5);
      const calculatedDelay = Math.round(numericAmount / 70000);

      setProjections({
        originalPercent: 76,
        newPercent: calculatedNewPercent,
        savingRateOld: 18,
        savingRateNew: savingRateImpact,
        delayDays: calculatedDelay || 1,
        savedAmount: numericAmount,
      });
    }, 2000);
  };

  const handleAction = (action: "CANCEL" | "PROCEED") => {
    if (action === "CANCEL") {
      setOutcome("CANCELLED");
      setAnalysisCompleted(false);
      reset({
        itemName: "",
        amount: "",
        category: "Lifestyle",
        isWant: false,
        isPromo: false,
        isLowMood: false,
      });
    } else {
      setOutcome("PROCEEDED");
      setAnalysisCompleted(false);
    }
  };

  // Currency input formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw) {
      const formatted = new Intl.NumberFormat("id-ID").format(Number(raw));
      setValue("amount", formatted);
    } else {
      setValue("amount", "");
    }
  };

  if (isPageLoading) {
    return <SkeletonPreSpending />;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Check First</h2>
        <p className="text-text-secondary text-sm max-w-lg">
          Simulate the impact of a purchase before your money leaves the wallet.
        </p>
      </header>

      {/* Outcome banners */}
      {outcome === "CANCELLED" && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-[24px] flex items-center gap-3 animate-fade-in">
          <FontAwesomeIcon icon={faCircleCheck} className="w-6 h-6 text-primary shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">Impulse Purchase Avoided!</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Saved Rp{projections.savedAmount.toLocaleString("id-ID")}. That money is safe in your pocket.
            </p>
          </div>
        </div>
      )}
      {outcome === "PROCEEDED" && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-[24px] flex items-center gap-3 animate-fade-in">
          <FontAwesomeIcon icon={faCircleXmark} className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-400">Purchase Logged</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Transaction recorded under behavioral tags. We will track how you feel about this item later.
            </p>
          </div>
        </div>
      )}

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs */}
        <section className="md:col-span-6 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col gap-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Planned Purchase</h3>
            
            <form onSubmit={handleSubmit(handleAnalyze)} className="space-y-5">
              
              {/* Item Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Item Name</label>
                <input
                  {...register("itemName")}
                  className="w-full h-12 bg-background border border-border rounded-[16px] px-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. New Sneakers"
                  type="text"
                  disabled={submittingState === "loading"}
                />
                {errors.itemName && (
                  <p className="text-xs text-red-400 font-bold ml-4 mt-0.5">{errors.itemName.message}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Amount</label>
                <div className="relative flex items-center">
                  <span className="absolute left-6 text-xl font-bold text-text-secondary">Rp</span>
                  <input
                    {...register("amount")}
                    onChange={handleAmountChange}
                    className="w-full bg-background border border-border rounded-[16px] pl-14 pr-6 py-4 text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-border"
                    placeholder="0"
                    type="text"
                    disabled={submittingState === "loading"}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-400 font-bold ml-4 mt-0.5">{errors.amount.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Category</label>
                <div className="relative">
                  <select
                    {...register("category")}
                    className="w-full appearance-none bg-background border border-border rounded-[16px] px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    disabled={submittingState === "loading"}
                  >
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Necessities">Necessities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                  <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                </div>
              </div>

              {/* Behavior Chips */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Behavior & Context</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setValue("isWant", !watchWant)}
                    disabled={submittingState === "loading"}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      watchWant
                        ? "bg-primary border-transparent text-primary-foreground shadow-md"
                        : "border-border text-text-secondary hover:border-primary/50"
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                    Want
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("isPromo", !watchPromo)}
                    disabled={submittingState === "loading"}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      watchPromo
                        ? "bg-primary border-transparent text-primary-foreground shadow-md"
                        : "border-border text-text-secondary hover:border-primary/50"
                    }`}
                  >
                    <FontAwesomeIcon icon={faTag} className="w-3.5 h-3.5" />
                    Promo
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("isLowMood", !watchLowMood)}
                    disabled={submittingState === "loading"}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      watchLowMood
                        ? "bg-primary border-transparent text-primary-foreground shadow-md"
                        : "border-border text-text-secondary hover:border-primary/50"
                    }`}
                  >
                    <FontAwesomeIcon icon={faFaceFrown} className="w-3.5 h-3.5" />
                    Low Mood
                  </button>
                </div>
              </div>

              {/* Submit / Analyze Impact */}
              <LoadingButton
                type="submit"
                state={submittingState}
                loadingText="Analyzing..."
                successText="Analyzed!"
                icon={faHeartPulse}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-full text-sm hover:brightness-105 mt-6"
              >
                Analyze Impact
              </LoadingButton>

            </form>
          </div>
        </section>

        {/* Right Column: Analysis Card */}
        <section className="md:col-span-6 lg:col-span-7">
          <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col gap-6 shadow-2xl h-full justify-between bg-gradient-to-br from-[#1E212B] to-[#251818]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Analysis Results</h3>
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <FontAwesomeIcon icon={faTriangleExclamation} className="w-3.5 h-3.5 text-red-400" />
                Risk Level: High
              </span>
            </div>

            {/* Insight 1: Budget Jump */}
            <div className="bg-background border border-border/50 p-5 rounded-2xl">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-semibold text-white">Lifestyle budget jump</span>
                <span className="text-xs font-bold text-primary">
                  {projections.originalPercent}% &rarr; {analysisCompleted ? projections.newPercent : 76}%
                </span>
              </div>
              <div className="h-4 w-full bg-border rounded-full overflow-hidden flex border border-border/40">
                <div className="h-full bg-text-secondary/40" style={{ width: `${projections.originalPercent}%` }}></div>
                {analysisCompleted && (
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse"
                    style={{ width: `${projections.newPercent - projections.originalPercent}%` }}
                  ></div>
                )}
              </div>
              <p className="text-[10px] text-text-secondary mt-2">
                {analysisCompleted
                  ? `You will have only Rp${(4000000 - projections.savedAmount < 0 ? 0 : 4000000 - projections.savedAmount).toLocaleString("id-ID")} remaining for the rest of the month.`
                  : "Calculate impact to see remaining monthly surplus."}
              </p>
            </div>

            {/* Insight 2: Saving Rate & Delay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-2xl border border-border/50 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                  <FontAwesomeIcon icon={faArrowTrendDown} className="w-3.5 h-3.5" /> Saving Rate
                </div>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-black text-white">
                    {analysisCompleted ? `${projections.savingRateNew}%` : "--"}
                  </span>
                  {analysisCompleted && <span className="text-xs text-text-secondary line-through">18%</span>}
                </div>
                <p className="text-[10px] text-text-secondary mt-1">Impact on monthly surplus</p>
              </div>

              <div className="bg-background p-4 rounded-2xl border border-border/50 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                  <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" /> Goal Delay
                </div>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-2xl font-black text-white">
                    {analysisCompleted ? `${projections.delayDays} Days` : "--"}
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary mt-1">Emergency fund target pushback</p>
              </div>
            </div>

            {/* Financial Friction Detected Placeholder */}
            <div className="bg-background/40 rounded-2xl border border-border/30 overflow-hidden relative min-h-[160px] flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] bg-[radial-gradient(circle_at_center,_#EF4444_20%,_transparent_50%)]"></div>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-6 relative z-10 space-y-2">
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 w-8 h-8" />
                <h4 className="text-sm font-bold text-white">Financial Friction Detected</h4>
                <p className="text-[10px] text-text-secondary max-w-xs leading-relaxed">
                  This purchase triggers &ldquo;Fear Of Missing Out&rdquo; patterns detected in your previous high-risk cycles.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                type="button"
                disabled={!analysisCompleted}
                onClick={() => handleAction("CANCEL")}
                className="flex-1 bg-transparent border border-border hover:bg-secondary/15 py-3 rounded-full text-xs font-bold text-white transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-40"
              >
                Cancel Purchase
              </button>
              <button
                type="button"
                disabled={!analysisCompleted}
                onClick={() => handleAction("PROCEED")}
                className="flex-1 border border-red-500/40 text-red-400 hover:bg-red-500/10 py-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-40"
              >
                Proceed Anyway
              </button>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
