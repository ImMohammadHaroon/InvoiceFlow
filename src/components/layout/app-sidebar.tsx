"use client";

import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";
import { FileText, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface AppSidebarProps {
  counts?: Partial<Record<InvoiceStatus | "all", number>>;
}

const filters: Array<{
  key: InvoiceStatus;
  label: string;
  color: string;
}> = [
  { key: "processing", label: "Processing", color: "bg-gray-400" },
  { key: "needs_review", label: "Needs Review", color: "bg-amber-400" },
  { key: "approved", label: "Approved", color: "bg-green-500" },
  { key: "rejected", label: "Rejected", color: "bg-red-500" },
];

export function AppSidebar({ counts }: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStatus = searchParams.get("status");
  const [mobileOpen, setMobileOpen] = useState(false);

  const invoicesActive = pathname.startsWith("/invoices");

  const content = (
    <aside className="flex h-full w-64 flex-col bg-[var(--sidebar)] text-white">
      <div className="px-4 py-5">
        <Link href="/invoices" onClick={() => setMobileOpen(false)}>
          <Image
            src="/logo.png"
            alt="InvoiceFlow"
            width={220}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="space-y-1 px-3">
        <Link
          href="/invoices"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            invoicesActive
              ? "bg-[var(--primary)]/20 text-white"
              : "text-gray-300 hover:bg-white/5 hover:text-white",
          )}
        >
          <FileText className="h-4 w-4" />
          Invoices
        </Link>
      </nav>

      <div className="mt-8 px-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Filters
        </p>
        <div className="mt-3 space-y-1">
          {filters.map((filter) => {
            const href = `/invoices?status=${filter.key}`;
            const isActive = activeStatus === filter.key;

            return (
              <Link
                key={filter.key}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      filter.color,
                      isActive && "ring-2 ring-white/40",
                    )}
                  />
                  {filter.label}
                </span>
                {typeof counts?.[filter.key] === "number" ? (
                  <span className="text-xs text-gray-500">
                    {counts[filter.key]}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-lg border border-gray-200 bg-white p-2 shadow-sm lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-700" />
      </button>

      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex">
        {content}
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex">
            {content}
            <button
              type="button"
              className="absolute right-3 top-3 rounded-md p-1 text-gray-300 hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
