"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faHeartPulse,
  faCircleCheck,
  faSpinner,
  faArrowUpRightFromSquare,
  faChartLine,
  faStar,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonSimulator } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";

// Form Validation Schema
const simulatorSchema = z.object({
  scenarioType: z.enum(["REDUCE", "INSTALLMENT", "INCOME", "SAVING"]),
  amount: z.string().refine((val) => !isNaN(Number(val.replace(/\./g, ""))) && Number(val.replace(/\./g, "")) > 0, {
    message: "Amount must be a positive number",
  }),
  frequency: z.enum(["MONTHLY", "WEEKLY", "ONETIME"]),
  duration: z.enum(["6_MONTHS", "12_MONTHS", "2_YEARS"]),
});

type SimulatorFormValues = z.infer<typeof simulatorSchema>;

export default function SimulatorPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [submittingState, setSubmittingState] = useState<"idle" | "loading" | "success">("idle");
  const [activeType, setActiveType] = useState<"REDUCE" | "INSTALLMENT" | "INCOME" | "SAVING">("REDUCE");

  // State projection outputs
  const [simResults, setSimResults] = useState({
    cashflowVal: 1800000,
    healthOld: 74,
    healthNew: 81,
    goalText: "Emergency Fund will be reached 2 months earlier.",
    isPositive: true,
    simulatedPathD: "M0,180 C100,170 200,150 300,130 C400,100 500,80 600,60 C700,45 800,30",
    simulatedAreaD: "M0,180 C100,170 200,150 300,130 C400,100 500,80 600,60 C700,45 800,30 V200 H0 Z",
  });

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SimulatorFormValues>({
    resolver: zodResolver(simulatorSchema),
    defaultValues: {
      scenarioType: "REDUCE",
      amount: "300.000",
      frequency: "MONTHLY",
      duration: "6_MONTHS",
    },
  });

  // Page mount loader simulation
  useState(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1500);
    return () => clearTimeout(timer);
  });

  // Run the calculations
  const runSimulation = (data: SimulatorFormValues) => {
    setSubmittingState("loading");
    const numericAmount = Number(data.amount.replace(/\./g, ""));

    // Calculate months multiplier
    let durationMultiplier = 6;
    if (data.duration === "12_MONTHS") durationMultiplier = 12;
    if (data.duration === "2_YEARS") durationMultiplier = 24;

    // Weekly multiplier adjustment
    let frequencyFactor = 1;
    if (data.frequency === "WEEKLY") frequencyFactor = 4;
    if (data.frequency === "ONETIME") durationMultiplier = 1;

    setTimeout(() => {
      setSubmittingState("success");
      setTimeout(() => setSubmittingState("idle"), 1200);

      const computedCashflow = numericAmount * durationMultiplier * frequencyFactor;
      const isPositive = activeType !== "INSTALLMENT";
      
      // Scale Health Score & Goal text based on type
      let calculatedHealthNew = 74;
      let calculatedGoalText = "";
      let pathD = "";
      let areaD = "";

      if (isPositive) {
        if (activeType === "INCOME") {
          calculatedHealthNew = 83;
          calculatedGoalText = "Emergency Fund will be reached 3 months earlier.";
          pathD = "M0,180 C100,165 200,140 300,110 C400,80 500,60 600,40 C700,25 800,10";
        } else if (activeType === "SAVING") {
          calculatedHealthNew = 82;
          calculatedGoalText = "Emergency Fund will be reached 2 months earlier.";
          pathD = "M0,180 C100,168 200,145 300,120 C400,90 500,70 600,50 C700,30 800,20";
        } else {
          // REDUCE spending
          calculatedHealthNew = 81;
          calculatedGoalText = "Emergency Fund will be reached 2 months earlier.";
          pathD = "M0,180 C100,170 200,150 300,130 C400,100 500,80 600,60 C700,45 800,30";
        }
      } else {
        // INSTALLMENT cost
        calculatedHealthNew = 68;
        calculatedGoalText = "Emergency Fund will be reached 1 month later.";
        pathD = "M0,180 C100,185 200,188 300,192 C400,195 500,196 600,197 C700,198 800,199";
      }

      areaD = `${pathD} V200 H0 Z`;

      setSimResults({
        cashflowVal: computedCashflow,
        healthOld: 74,
        healthNew: calculatedHealthNew,
        goalText: calculatedGoalText,
        isPositive,
        simulatedPathD: pathD,
        simulatedAreaD: areaD,
      });
    }, 2000);
  };

  // Change active type and bind value
  const handleTypeSelect = (type: "REDUCE" | "INSTALLMENT" | "INCOME" | "SAVING") => {
    setActiveType(type);
    setValue("scenarioType", type);
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
    return <SkeletonSimulator />;
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Scenario Simulator</h1>
        <p className="text-text-secondary text-sm">See the future impact of your financial decisions today.</p>
      </header>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Simulation Controls */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col gap-6 shadow-2xl">
            
            <form onSubmit={handleSubmit(runSimulation)} className="space-y-5">
              
              {/* Scenario Type Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-2">Scenario Type</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeSelect("REDUCE")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeType === "REDUCE"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border text-text-secondary hover:border-primary"
                    }`}
                  >
                    Reduce spending
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeSelect("INSTALLMENT")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeType === "INSTALLMENT"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border text-text-secondary hover:border-primary"
                    }`}
                  >
                    Add installment
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeSelect("INCOME")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeType === "INCOME"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border text-text-secondary hover:border-primary"
                    }`}
                  >
                    Increase income
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeSelect("SAVING")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      activeType === "SAVING"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "border border-border text-text-secondary hover:border-primary"
                    }`}
                  >
                    Increase saving
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-2">Amount</label>
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

              {/* Frequency and Duration */}
              <div className="grid grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-2">Frequency</label>
                  <div className="relative">
                    <select
                      {...register("frequency")}
                      className="w-full appearance-none bg-background border border-border rounded-[16px] px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                      disabled={submittingState === "loading"}
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="ONETIME">One-time</option>
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-2">Duration</label>
                  <div className="relative">
                    <select
                      {...register("duration")}
                      className="w-full appearance-none bg-background border border-border rounded-[16px] px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                      disabled={submittingState === "loading"}
                    >
                      <option value="6_MONTHS">6 Months</option>
                      <option value="12_MONTHS">12 Months</option>
                      <option value="2_YEARS">2 Years</option>
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Run Simulation Trigger */}
              <LoadingButton
                type="submit"
                state={submittingState}
                loadingText="Simulating..."
                successText="Simulated!"
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-full text-xs uppercase tracking-widest hover:brightness-105 mt-6"
              >
                Run Simulation
              </LoadingButton>

            </form>
          </div>

          {/* AI Banner Card */}
          <div className="h-32 rounded-[24px] border border-border bg-card p-6 flex flex-col justify-end relative">
            <div className="absolute top-4 right-4 bg-primary/10 p-2 rounded-xl text-primary animate-pulse border border-primary/20">
              <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-primary font-black">A.I. Engine</span>
              <p className="text-xs text-text-secondary mt-1">Real-time predictive analysis active.</p>
            </div>
          </div>
        </section>

        {/* Right Column: Projection Results Grid */}
        <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart card (Spans 2 columns) */}
          <div className="md:col-span-2 bg-card rounded-[24px] border border-border p-6 min-h-[300px] flex flex-col justify-between shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white leading-none">Projection Forecast</h3>
                <p className="text-xs text-text-secondary mt-2">Comparing baseline vs. simulated savings</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-text-secondary/60"></div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Baseline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Simulated</span>
                </div>
              </div>
            </div>

            {/* SVG Chart paths */}
            <div className="flex-grow w-full relative h-48 mt-6">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 200">
                {/* Horizontal grid guide lines */}
                <line stroke="#2C303F" strokeDasharray="4" x1="0" x2="800" y1="40" y2="40"></line>
                <line stroke="#2C303F" strokeDasharray="4" x1="0" x2="800" y1="100" y2="100"></line>
                <line stroke="#2C303F" strokeDasharray="4" x1="0" x2="800" y1="160" y2="160"></line>
                
                {/* Baseline Gray line */}
                <path d="M0,180 C100,175 200,170 300,160 C400,150 500,145 600,140 C700,135 800,130" fill="none" stroke="#8d9479" strokeOpacity="0.5" strokeWidth="2"></path>
                
                {/* Simulated Glow line */}
                <path
                  d={simResults.simulatedPathD}
                  fill="none"
                  stroke={simResults.isPositive ? "#BFFF00" : "#EF4444"}
                  strokeWidth="4"
                  className="transition-all duration-700 ease-out"
                ></path>
                
                {/* Area background Gradient */}
                <path
                  d={simResults.simulatedAreaD}
                  fill="url(#neon-gradient)"
                  opacity="0.1"
                  className="transition-all duration-700 ease-out"
                ></path>

                <defs>
                  <linearGradient id="neon-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={simResults.isPositive ? "#BFFF00" : "#EF4444"}></stop>
                    <stop offset="100%" stopColor="transparent"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Metric 1: Projected Cashflow */}
          <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Projected Cashflow</span>
              <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-primary">
                <FontAwesomeIcon icon={faCoins} className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-6">
              <div className={`text-2xl font-black tabular-nums ${simResults.isPositive ? "text-primary" : "text-red-400"}`}>
                {simResults.isPositive ? "+" : "-"}Rp{simResults.cashflowVal.toLocaleString("id-ID")}
              </div>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider mt-1.5">Cumulative projection timeline</p>
            </div>
          </div>

          {/* Metric 2: Health Score Impact */}
          <div className="bg-card border border-border rounded-[24px] p-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Health Score Impact</span>
              <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-primary">
                <FontAwesomeIcon icon={faHeartPulse} className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div className="text-2xl font-black text-white flex items-center gap-1.5 leading-none">
                {simResults.healthOld} <span className="text-primary text-sm font-semibold">&rarr;</span> {simResults.healthNew}
              </div>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className={`w-6 h-6 shrink-0 transition-transform ${simResults.isPositive ? "text-primary rotate-0" : "text-red-400 rotate-90"}`} />
            </div>
          </div>

          {/* Metric 3: Goal progress (Spans 2 columns) */}
          <div className="md:col-span-2 bg-card border border-primary/15 rounded-[24px] p-6 flex items-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <FontAwesomeIcon icon={faCircleCheck} className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Goal Progress</h4>
              <p className="text-xs font-semibold text-primary mt-1">{simResults.goalText}</p>
            </div>
          </div>

          {/* Optimization Suggestion Box */}
          <div className="md:col-span-2 bg-white text-black rounded-[24px] p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-black/10 overflow-hidden shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuArozDKfKkxhtyu7CxxYi6W9paYXAWFsBh-sCferdHeZJczxiyC37H9d5NNT436oPty5HYatcuZysuwsTK-qWHhaemLt9D_UtN079InZlrASUfQJh2HWMXbCrJEYJoHSD5f8u8F8bAr7DkCVMmN51l2Fc1YJAU1gFjzaFjw0-bD0tC-z4FErHzY9iGCHJqwJG9XISTlE-L3De1gzbwPE0A4Jg45y--orKyynlTDqkDDWzBP6qlRTqgZ1HF3xmkWe9_YVrjXageb_Qc"
                  alt="A.I. microchip suggestion graphic"
                />
              </div>
              <div>
                <p className="font-black text-xs">Optimization Tip</p>
                <p className="text-xs text-black/70 mt-0.5">Redirect these savings to your &apos;Crypto&apos; bucket for +2% growth.</p>
              </div>
            </div>
            <button className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs hover:brightness-110 active:scale-95 transition-all">
              Apply Now
            </button>
          </div>

        </section>

      </div>
    </div>
  );
}
