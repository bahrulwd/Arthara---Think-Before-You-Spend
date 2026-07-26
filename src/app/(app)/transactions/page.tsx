"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faBolt,
  faTriangleExclamation,
  faLightbulb,
  faPlus,
  faSpinner,
  faChevronDown,
  faBagShopping,
  faMugSaucer,
  faArrowRight,
  faPlus as faPlusIcon,
  faPen,
  faTrashCan,
  faCircleCheck
} from "@fortawesome/free-solid-svg-icons";
import { SkeletonTransactions } from "@/components/ui/skeletons";
import { LoadingButton } from "@/components/ui/loading-button";

// Form Validation Schema
const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Please select a date"),
  note: z.string().min(1, "Please enter a note or merchant name"),
  needLevel: z.enum(["NEED", "WANT", "INVESTMENT", "IMPULSE"]).optional().nullable(),
  spendingTrigger: z.enum(["PLANNED", "PROMO", "STRESS", "SOCIAL"]).optional().nullable(),
  priorityAlignment: z.enum(["HIGH", "MEDIUM", "LOW"]).optional().nullable(),
  mightRegret: z.boolean().optional().nullable(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

import { useEffect } from "react";

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;
  const showAddForm = searchParams.get("add") === "true" || isEditing;
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<"idle" | "loading" | "success">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeletingTransaction, setIsDeletingTransaction] = useState(false);
  const [deleteSuccessNotification, setDeleteSuccessNotification] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((tx: any) => ({
          id: tx.id,
          note: tx.description || "",
          category: tx.category,
          amount: Number(tx.amount),
          type: tx.type,
          date: new Date(tx.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          rawDate: tx.date ? tx.date.split("T")[0] : new Date().toISOString().split("T")[0],
          needLevel: tx.behavioralTag || "WANT",
          spendingTrigger: tx.moodBefore || "PLANNED",
          mightRegret: tx.moodAfter === "Regretful",
        }));
        setTransactions(mapped);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  useEffect(() => {
    const setupAndLoad = async () => {
      setIsLoading(true);
      const startTime = Date.now();
      try {
        // Ensure default user is seeded
        await fetch("/api/init");
        await fetchTransactions();
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(1500 - elapsed, 0);
        if (remainingDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingDelay));
        }
        setIsLoading(false);
      }
    };
    setupAndLoad();
  }, []);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      category: "Lifestyle",
      date: new Date().toISOString().split("T")[0],
      note: "",
      needLevel: "WANT",
      spendingTrigger: "PROMO",
      priorityAlignment: "LOW",
      mightRegret: true,
    },
  });

  const watchType = watch("type");
  const watchNeedLevel = watch("needLevel");
  const watchSpendingTrigger = watch("spendingTrigger");
  const watchPriorityAlignment = watch("priorityAlignment");
  const watchMightRegret = watch("mightRegret");

  // Reset form when form modal show status or edit target changes
  useEffect(() => {
    if (showAddForm) {
      setIsSubmitting("idle");
      if (isEditing && transactions.length > 0) {
        const tx = transactions.find((t) => t.id === editId);
        if (tx) {
          setValue("type", tx.type);
          setValue("amount", String(tx.amount));
          setValue("category", tx.category);
          setValue("date", tx.rawDate);
          setValue("note", tx.note);
          setValue("needLevel", tx.needLevel);
          setValue("spendingTrigger", tx.spendingTrigger);
          setValue("mightRegret", tx.mightRegret);
        }
      } else if (!isEditing) {
        reset({
          type: "EXPENSE",
          amount: "",
          category: "Lifestyle",
          date: new Date().toISOString().split("T")[0],
          note: "",
          needLevel: "WANT",
          spendingTrigger: "PROMO",
          priorityAlignment: "LOW",
          mightRegret: true,
        });
      }
    }
  }, [showAddForm, editId, isEditing, transactions, setValue, reset]);

  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting("loading");
    try {
      const url = "/api/transactions";
      const method = isEditing ? "PUT" : "POST";
      
      // Filter behavioral tag data if type is INCOME
      const requestPayload = {
        ...(isEditing ? { id: editId } : {}),
        type: data.type,
        amount: data.amount,
        category: data.category,
        date: data.date,
        note: data.note,
        needLevel: data.type === "EXPENSE" ? data.needLevel : null,
        spendingTrigger: data.type === "EXPENSE" ? data.spendingTrigger : null,
        priorityAlignment: data.type === "EXPENSE" ? data.priorityAlignment : null,
        mightRegret: data.type === "EXPENSE" ? data.mightRegret : false,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      if (res.ok) {
        setIsSubmitting("success");
        await fetchTransactions();
        setTimeout(() => router.push("/transactions"), 800);
      } else {
        setIsSubmitting("idle");
        const err = await res.json();
        alert(err.error || "Failed to save transaction");
      }
    } catch (err) {
      console.error("Failed to save transaction:", err);
      setIsSubmitting("idle");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeletingTransaction(true);
    try {
      const res = await fetch(`/api/transactions?id=${deleteTargetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteSuccessNotification("Catatan transaksi telah dihapus secara permanen dari database.");
        await fetchTransactions();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete transaction");
      }
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    } finally {
      setIsDeletingTransaction(false);
      setDeleteTargetId(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  useEffect(() => {
    if (deleteSuccessNotification) {
      const timer = setTimeout(() => {
        setDeleteSuccessNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccessNotification]);

  if (isLoading) {
    return <SkeletonTransactions />;
  }

  if (showAddForm) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Form Container */}
        <div className="bg-card rounded-[24px] overflow-hidden shadow-2xl border border-border">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-white">{isEditing ? "Edit Transaction" : "Add Transaction"}</h1>
            
            {/* Income / Expense Toggle */}
            <div className="bg-background border border-border p-1 rounded-full flex w-fit min-w-[200px]">
              <button
                type="button"
                onClick={() => setValue("type", "INCOME")}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                  watchType === "INCOME"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "EXPENSE")}
                className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
                  watchType === "EXPENSE"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`grid grid-cols-1 ${watchType === "EXPENSE" ? "md:grid-cols-2" : ""}`}>
              
              {/* Left Column: Standard Finance Details */}
              <div className={`p-6 md:p-8 space-y-6 ${watchType === "EXPENSE" ? "border-b md:border-b-0 md:border-r border-border" : "col-span-1 max-w-xl mx-auto w-full"}`}>
                
                {/* Amount Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Amount</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-6 text-xl font-bold text-text-secondary">Rp</span>
                    <input
                      {...register("amount")}
                      className="w-full bg-background border border-border rounded-[16px] pl-14 pr-6 py-4 text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-border"
                      placeholder="0"
                      type="text"
                      disabled={isSubmitting === "loading"}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-xs text-red-400 font-bold mt-1">{errors.amount.message}</p>
                  )}
                </div>

                {/* Category Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Category</label>
                  <div className="relative">
                    <select
                      {...register("category")}
                      className="w-full appearance-none bg-background border border-border rounded-[16px] px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                      disabled={isSubmitting === "loading"}
                    >
                      {watchType === "INCOME" ? (
                        <>
                          <option value="Salary">Salary</option>
                          <option value="Investment Return">Investment Return</option>
                          <option value="Freelance">Freelance</option>
                          <option value="Gift">Gift</option>
                          <option value="Other">Other</option>
                        </>
                      ) : (
                        <>
                          <option value="Lifestyle">Lifestyle</option>
                          <option value="Food & Drinks">Food & Drinks</option>
                          <option value="Transport">Transport</option>
                          <option value="Health">Health</option>
                          <option value="Housing">Housing</option>
                          <option value="Other">Other</option>
                        </>
                      )}
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                  </div>
                  {errors.category && (
                    <p className="text-xs text-red-400 font-bold mt-1">{errors.category.message}</p>
                  )}
                </div>

                {/* Date Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Date</label>
                  <div className="relative">
                    <input
                      {...register("date")}
                      className="w-full bg-background border border-border rounded-[16px] px-6 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      type="date"
                      disabled={isSubmitting === "loading"}
                    />
                  </div>
                  {errors.date && (
                    <p className="text-xs text-red-400 font-bold mt-1">{errors.date.message}</p>
                  )}
                </div>

                {/* Note Field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">Note / Merchant</label>
                  <input
                    {...register("note")}
                    className="w-full bg-background border border-border rounded-[16px] px-6 py-3.5 text-sm text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder={watchType === "INCOME" ? "e.g. Monthly Salary Paycheck" : "e.g. Starbucks Coffee"}
                    type="text"
                    disabled={isSubmitting === "loading"}
                  />
                  {errors.note && (
                    <p className="text-xs text-red-400 font-bold mt-1">{errors.note.message}</p>
                  )}
                </div>
              </div>

              {/* Right Column: Behavioral Context Details (Only for Expense) */}
              {watchType === "EXPENSE" && (
                <div className="p-6 md:p-8 space-y-6 bg-background/20">
                  
                  {/* Need Level */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faBrain} className="w-4 h-4 text-primary" /> Need Level
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["NEED", "WANT", "INVESTMENT", "IMPULSE"] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setValue("needLevel", level)}
                          disabled={isSubmitting === "loading"}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            watchNeedLevel === level
                              ? "bg-primary border-transparent text-primary-foreground shadow-md"
                              : "border-border text-text-secondary hover:border-primary/50"
                          }`}
                        >
                          {level.charAt(0) + level.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spending Trigger */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-primary" /> Spending Trigger
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(["PLANNED", "PROMO", "STRESS", "SOCIAL"] as const).map((trigger) => (
                        <button
                          key={trigger}
                          type="button"
                          onClick={() => setValue("spendingTrigger", trigger)}
                          disabled={isSubmitting === "loading"}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            watchSpendingTrigger === trigger
                              ? "bg-primary border-transparent text-primary-foreground shadow-md"
                              : "border-border text-text-secondary hover:border-primary/50"
                          }`}
                        >
                          {trigger.charAt(0) + trigger.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Alignment */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4 text-primary" /> Priority Alignment
                    </label>
                    <div className="bg-background border border-border p-1 rounded-full flex w-full max-w-[280px]">
                      {(["HIGH", "MEDIUM", "LOW"] as const).map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setValue("priorityAlignment", priority)}
                          disabled={isSubmitting === "loading"}
                          className={`flex-1 py-1.5 px-3 rounded-full text-[10px] font-bold uppercase transition-all ${
                            watchPriorityAlignment === priority
                              ? "bg-secondary text-white font-bold"
                              : "text-text-secondary hover:text-white"
                          }`}
                        >
                          {priority.toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Regret Switch */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between bg-background p-4 rounded-[16px] border border-border">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-primary w-5 h-5" />
                        <span className="text-xs font-bold text-white">I might regret this</span>
                      </div>
                      
                      {/* Toggle Button */}
                      <button
                        type="button"
                        disabled={isSubmitting === "loading"}
                        onClick={() => setValue("mightRegret", !watchMightRegret)}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${
                          watchMightRegret ? "bg-primary" : "bg-secondary/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full absolute top-1 left-1 transition-transform duration-200 shadow-sm ${
                            watchMightRegret ? "translate-x-6 bg-primary-foreground" : "bg-text-secondary"
                          }`}
                        ></span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="p-6 md:p-8 bg-card/65 border-t border-border flex items-center justify-end gap-4">
              <Link
                href="/transactions"
                className="w-full md:w-auto px-6 py-2.5 rounded-full text-center text-text-secondary text-xs font-bold hover:text-white transition-colors active:scale-95 duration-150"
              >
                Cancel
              </Link>
              <LoadingButton
                type="submit"
                state={isSubmitting}
                loadingText="Saving..."
                successText="Tersimpan!"
                className="w-full md:w-auto px-10 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-full shadow-lg shadow-primary/10 hover:brightness-105"
              >
                {isEditing ? "Update Transaction" : "Save Transaction"}
              </LoadingButton>
            </div>
          </form>
        </div>

        {/* Behavioral insights callout */}
        <div className="p-4 bg-primary/5 border border-primary/15 rounded-[16px] flex items-start gap-4">
          <FontAwesomeIcon icon={faLightbulb} className="text-primary w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            <span className="text-primary font-bold">Insight:</span> Transactions marked as <span className="text-white italic font-semibold">"Promo"</span> and <span className="text-white italic font-semibold">"Impulse"</span> account for 32% of your monthly Lifestyle budget. Consider waiting 24 hours before your next big purchase.
          </p>
        </div>
      </div>
    );
  }

  // DEFAULT STATE: Transactions History List
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Transactions</h1>
          <p className="text-text-secondary text-sm">View past purchases with cognitive and emotional tags.</p>
        </div>
        <Link
          href="/transactions?add=true"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full text-xs shadow-lg shadow-primary/10 hover:brightness-105 active:scale-95 transition-all"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Add Transaction
        </Link>
      </div>

      {deleteSuccessNotification && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-[20px] flex items-center justify-between gap-3 animate-fade-in shadow-lg shadow-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Transaksi Dihapus</p>
              <p className="text-[11px] text-text-secondary mt-1">{deleteSuccessNotification}</p>
            </div>
          </div>
          <button
            onClick={() => setDeleteSuccessNotification(null)}
            className="text-text-secondary hover:text-white text-[11px] font-bold px-3 py-1.5 border border-border/40 rounded-full hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="bg-card rounded-[24px] border border-border p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-text-secondary text-[10px] uppercase font-bold tracking-wider">
                <th className="pb-3">Note / Merchant</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Need Level</th>
                <th className="pb-3">Trigger</th>
                <th className="pb-3">Regret Risk</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="py-4.5 font-semibold text-white">{tx.note}</td>
                  <td className="py-4.5 text-text-secondary">{tx.category}</td>
                  <td className="py-4.5">
                    {tx.type === "EXPENSE" ? (
                      <span className="px-2.5 py-0.5 bg-background border border-border text-text-secondary text-[9px] rounded-full font-bold uppercase tracking-wider">
                        {tx.needLevel}
                      </span>
                    ) : (
                      <span className="text-text-secondary text-xs">—</span>
                    )}
                  </td>
                  <td className="py-4.5">
                    {tx.type === "EXPENSE" ? (
                      <span className="px-2.5 py-0.5 bg-background border border-border text-text-secondary text-[9px] rounded-full font-bold uppercase tracking-wider">
                        {tx.spendingTrigger}
                      </span>
                    ) : (
                      <span className="text-text-secondary text-xs">—</span>
                    )}
                  </td>
                  <td className="py-4.5">
                    {tx.type === "EXPENSE" ? (
                      tx.mightRegret ? (
                        <span className="text-red-400 text-xs font-bold flex items-center gap-1">
                          <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4" /> High Risk
                        </span>
                      ) : (
                        <span className="text-text-secondary text-xs">Low Risk</span>
                      )
                    ) : (
                      <span className="text-text-secondary text-xs">—</span>
                    )}
                  </td>
                  <td className={`py-4.5 text-right font-bold tabular-nums ${tx.type === "EXPENSE" ? "text-red-400" : "text-primary"}`}>
                    {tx.type === "EXPENSE" ? "-" : "+"}Rp{tx.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="py-4.5 text-right pr-4">
                    <div className="flex justify-end gap-3.5">
                      <button
                        onClick={() => router.push(`/transactions?edit=${tx.id}`)}
                        className="text-text-secondary hover:text-white transition-colors cursor-pointer"
                        title="Edit Transaction"
                      >
                        <FontAwesomeIcon icon={faPen} className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="text-text-secondary hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Transaction"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-text-secondary text-xs">
                    Belum ada transaksi terekam.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTargetId && (() => {
        const targetTx = transactions.find((t) => t.id === deleteTargetId);
        return (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-gradient-to-br from-background/90 via-card/95 to-background/90 border border-border/80 rounded-[32px] max-w-md w-full p-6 md:p-8 space-y-6 shadow-2xl shadow-red-500/5 relative animate-scale-up hover:border-red-500/20 transition-colors">
              
              {/* Header: Alert layout */}
              <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shrink-0">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-white tracking-tight leading-none">Konfirmasi Hapus</h3>
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-1.5 block">Tindakan Permanen</span>
                </div>
              </div>

              {/* Warning Message */}
              <p className="text-xs text-text-secondary leading-relaxed text-left">
                Apakah Anda yakin ingin menghapus transaksi ini dari buku catatan keuangan? Data yang dihapus tidak dapat dipulihkan kembali.
              </p>

              {/* Selected Transaction Metadata Details */}
              {targetTx && (
                <div className="bg-background/45 border border-border/55 rounded-2xl p-4 space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Detail Transaksi</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                      targetTx.type === "EXPENSE" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-primary/10 text-primary border-primary/20"
                    }`}>
                      {targetTx.type}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white leading-tight truncate">{targetTx.note}</p>
                  <div className="flex justify-between items-baseline pt-2.5 border-t border-border/30">
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">Nominal</span>
                    <span className={`text-base font-black tabular-nums ${targetTx.type === "EXPENSE" ? "text-red-400" : "text-primary"}`}>
                      {targetTx.type === "EXPENSE" ? "-" : "+"}Rp{targetTx.amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  disabled={isDeletingTransaction}
                  className="flex-1 py-3 border border-border bg-background/40 text-text-secondary hover:text-white rounded-full font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Batal
                </button>
                <LoadingButton
                  onClick={confirmDelete}
                  state={isDeletingTransaction ? "loading" : "idle"}
                  loadingText="Menghapus..."
                  successText="Terhapus!"
                  className="flex-1 py-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Hapus
                </LoadingButton>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default function TransactionsPageWithSuspense() {
  return (
    <Suspense fallback={<SkeletonTransactions />}>
      <TransactionsContent />
    </Suspense>
  );
}
