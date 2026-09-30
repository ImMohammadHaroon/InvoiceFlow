import { cn, statusLabel } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";
import Link from "next/link";

interface InvoiceTabsProps {
  active: InvoiceStatus | "all";
  counts: Record<InvoiceStatus | "all", number>;
  searchQuery?: string;
}

const tabs: Array<{ key: InvoiceStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "processing", label: "Processing" },
  { key: "needs_review", label: "Needs Review" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export function InvoiceTabs({
  active,
  counts,
  searchQuery,
}: InvoiceTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-gray-200">
      {tabs.map((tab) => {
        const params = new URLSearchParams();
        if (tab.key !== "all") params.set("status", tab.key);
        if (searchQuery) params.set("q", searchQuery);
        const query = params.toString();
        const href = query ? `/invoices?${query}` : "/invoices";
        const isActive = active === tab.key;
        const label = tab.key === "all" ? "All" : statusLabel(tab.key);

        return (
          <Link
            key={tab.key}
            href={href}
            className={cn(
              "relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-800",
            )}
          >
            {label} ({counts[tab.key] ?? 0})
            {isActive ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--primary)]" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
