import { format as formatDateFns } from "date-fns";

/**
 * Formats a numeric amount as currency (USD default).
 */
export function formatCurrency(amount: number | DecimalValue): string {
  const numericAmount = typeof amount === "number" ? amount : Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
}

/**
 * Formats a percentage value (e.g. 0.185 -> 18.5%).
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Formats a date using date-fns pattern.
 */
export function formatDate(date: Date | string | number, pattern = "MMM dd, yyyy"): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return formatDateFns(dateObj, pattern);
}

/**
 * Formats a large number compactly (e.g. 1500 -> 1.5K).
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

// Temporary custom type placeholder to represent Prisma Decimal values if imported
type DecimalValue = { toString(): string } | number;
