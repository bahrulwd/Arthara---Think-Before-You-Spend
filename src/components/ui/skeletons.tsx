// Skeleton loading components with shimmer effect
// Usage: import { SkeletonDashboard } from "@/components/ui/skeletons";

import React from "react";

// ── Base Skeleton ───────────────────────────────────────────────────────────

function Sk({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />;
}

function SkCircle({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-full ${className}`} />;
}

// ── Dashboard Skeleton ──────────────────────────────────────────────────────

export function SkeletonDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* KPI row */}
      <div className="grid grid-cols-12 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="col-span-12 lg:col-span-4 bg-card rounded-[24px] p-6 border border-border space-y-4">
            <div className="flex justify-between items-start">
              <Sk className="h-3 w-24" />
              <SkCircle className="w-5 h-5" />
            </div>
            <Sk className="h-9 w-32 rounded-xl" />
            <Sk className="h-3 w-40" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-background/40 rounded-xl p-3 space-y-2">
                <Sk className="h-2.5 w-12" />
                <Sk className="h-4 w-20" />
              </div>
              <div className="bg-background/40 rounded-xl p-3 space-y-2">
                <Sk className="h-2.5 w-12" />
                <Sk className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Transactions */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-8">
            <Sk className="h-7 w-48 skeleton-light" />
            <Sk className="h-4 w-16 skeleton-light" />
          </div>
          <div className="space-y-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SkCircle className="w-12 h-12 skeleton-light" />
                  <div className="space-y-2">
                    <Sk className="h-4 w-32 skeleton-light" />
                    <Sk className="h-3 w-20 skeleton-light" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Sk className="h-4 w-24 skeleton-light" />
                  <Sk className="h-3 w-12 skeleton-light" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side cards */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bg-card rounded-[32px] p-8 border border-border flex-1 space-y-6">
            <SkCircle className="w-14 h-14" />
            <Sk className="h-6 w-44" />
            <Sk className="h-4 w-full" />
            <Sk className="h-4 w-3/4" />
            <Sk className="h-12 rounded-full mt-auto" />
          </div>
          <div className="bg-card rounded-[24px] p-6 border border-border">
            <div className="flex items-center gap-4">
              <SkCircle className="w-12 h-12" />
              <div className="space-y-2 flex-1">
                <Sk className="h-3 w-20" />
                <Sk className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Transactions Skeleton ───────────────────────────────────────────────────

export function SkeletonTransactions() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Sk className="h-8 w-52" />
          <Sk className="h-4 w-72" />
        </div>
        <Sk className="h-10 w-36 rounded-full" />
      </div>

      {/* AI Insight banner */}
      <div className="bg-card rounded-[24px] p-5 border border-border">
        <div className="flex items-start gap-4">
          <SkCircle className="w-10 h-10 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Sk className="h-4 w-48" />
            <Sk className="h-3 w-full" />
            <Sk className="h-3 w-3/4" />
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-[20px] p-5 border border-border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SkCircle className="w-12 h-12" />
              <div className="space-y-2">
                <Sk className="h-4 w-36" />
                <div className="flex gap-2">
                  <Sk className="h-5 w-16 rounded-full" />
                  <Sk className="h-5 w-14 rounded-full" />
                </div>
              </div>
            </div>
            <div className="text-right space-y-1">
              <Sk className="h-4 w-24" />
              <Sk className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Budgets Skeleton ────────────────────────────────────────────────────────

export function SkeletonBudgets() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Sk className="h-8 w-44" />
          <Sk className="h-4 w-64" />
        </div>
        <Sk className="h-10 w-36 rounded-full" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-[20px] p-5 border border-border space-y-3">
            <Sk className="h-3 w-20" />
            <Sk className="h-7 w-32" />
            <Sk className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Budget cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-[24px] p-6 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkCircle className="w-10 h-10" />
                <div className="space-y-1.5">
                  <Sk className="h-4 w-28" />
                  <Sk className="h-3 w-20" />
                </div>
              </div>
              <Sk className="h-6 w-14 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Sk className="h-3 w-16" />
                <Sk className="h-3 w-16" />
              </div>
              <Sk className="h-2.5 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Goals Skeleton ──────────────────────────────────────────────────────────

export function SkeletonGoals() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Sk className="h-8 w-44" />
          <Sk className="h-4 w-60" />
        </div>
        <Sk className="h-10 w-36 rounded-full" />
      </div>

      {/* Mindset insight */}
      <div className="bg-card rounded-[24px] p-6 border border-border">
        <div className="flex gap-4 items-start">
          <SkCircle className="w-10 h-10 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Sk className="h-4 w-48" />
            <Sk className="h-3 w-full" />
          </div>
        </div>
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-[28px] p-6 border border-border space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <SkCircle className="w-12 h-12" />
                <div className="space-y-1.5">
                  <Sk className="h-5 w-32" />
                  <Sk className="h-3 w-20" />
                </div>
              </div>
              <Sk className="h-6 w-10 rounded-full" />
            </div>
            <Sk className="h-2.5 w-full rounded-full" />
            <div className="flex justify-between">
              <Sk className="h-4 w-20" />
              <Sk className="h-4 w-20" />
            </div>
            <Sk className="h-10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reports Skeleton ────────────────────────────────────────────────────────

export function SkeletonReports() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <Sk className="h-8 w-52" />
        <Sk className="h-4 w-72" />
      </div>

      {/* Month picker */}
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <Sk key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-card rounded-[24px] p-6 border border-border space-y-4">
        <div className="flex justify-between items-center">
          <Sk className="h-5 w-40" />
          <Sk className="h-8 w-28 rounded-full" />
        </div>
        <div className="flex items-end gap-2 h-48 pt-4">
          {[...Array(12)].map((_, i) => (
            <Sk key={i} className={`flex-1 rounded-t-lg`} style={{ height: `${30 + Math.sin(i * 0.8) * 40 + 40}%` }} />
          ))}
        </div>
        <div className="flex justify-between">
          {[...Array(6)].map((_, i) => <Sk key={i} className="h-3 w-8" />)}
        </div>
      </div>

      {/* Transaction table */}
      <div className="bg-card rounded-[24px] border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <Sk className="h-5 w-40" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between px-6 py-5 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <SkCircle className="w-10 h-10" />
              <Sk className="h-4 w-36" />
            </div>
            <Sk className="h-4 w-20" />
            <Sk className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MoneyLeak Skeleton ──────────────────────────────────────────────────────

export function SkeletonMoneyLeak() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <Sk className="h-8 w-52" />
        <Sk className="h-4 w-80" />
      </div>

      {/* Summary bar */}
      <div className="bg-card rounded-[24px] p-6 border border-border">
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <Sk className="h-7 w-20 mx-auto" />
              <Sk className="h-3 w-24 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Leak cards */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-[24px] p-6 border border-border space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <SkCircle className="w-12 h-12" />
                <div className="space-y-2">
                  <Sk className="h-5 w-40" />
                  <Sk className="h-3 w-24" />
                </div>
              </div>
              <Sk className="h-6 w-20 rounded-full" />
            </div>
            <Sk className="h-3 w-full" />
            <Sk className="h-3 w-4/5" />
            <div className="flex gap-3">
              <Sk className="h-9 flex-1 rounded-full" />
              <Sk className="h-9 flex-1 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Simulator Skeleton ──────────────────────────────────────────────────────

export function SkeletonSimulator() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <Sk className="h-8 w-52" />
        <Sk className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-card rounded-[28px] p-8 border border-border space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Sk className="h-3 w-28" />
              <Sk className="h-12 w-full rounded-xl" />
            </div>
          ))}
          <Sk className="h-12 w-full rounded-full" />
        </div>

        {/* Result */}
        <div className="bg-card rounded-[28px] p-8 border border-border space-y-6">
          <Sk className="h-6 w-40" />
          <div className="text-center space-y-3 py-4">
            <Sk className="h-16 w-48 mx-auto rounded-2xl" />
            <Sk className="h-4 w-32 mx-auto" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between py-3 border-b border-border">
              <Sk className="h-3 w-32" />
              <Sk className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pre-Spending Skeleton ───────────────────────────────────────────────────

export function SkeletonPreSpending() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <Sk className="h-8 w-52" />
        <Sk className="h-4 w-72" />
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-card rounded-[28px] p-8 border border-border space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Sk className="h-3 w-32" />
              <Sk className="h-12 w-full rounded-xl" />
            </div>
          ))}
          <Sk className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── Settings Skeleton ───────────────────────────────────────────────────────

export function SkeletonSettings() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <Sk className="h-8 w-36" />
        <Sk className="h-4 w-60" />
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card rounded-[24px] p-6 border border-border space-y-5">
          <Sk className="h-5 w-40" />
          {[...Array(3)].map((_, j) => (
            <div key={j} className="flex items-center justify-between py-4 border-b border-border last:border-0">
              <div className="space-y-1.5">
                <Sk className="h-4 w-36" />
                <Sk className="h-3 w-52" />
              </div>
              <Sk className="h-8 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
