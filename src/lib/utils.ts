import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { InvoiceStatus } from "@/types/invoice";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1000) {
    const thousands = amount / 1000;
    const formatted =
      thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1);
    return `$${formatted}K`;
  }
  return formatCurrency(amount);
}

export function formatDate(date: string | null): string {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export function formatDateShort(date: string | null): string {
  if (!date) return "—";
  const parsed = new Date(`${date}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function statusLabel(status: InvoiceStatus): string {
  switch (status) {
    case "processing":
      return "Processing";
    case "needs_review":
      return "Needs Review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
  }
}

export function isFinalStatus(status: InvoiceStatus): boolean {
  return status === "approved" || status === "rejected";
}
