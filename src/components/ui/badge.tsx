import { cn, statusLabel } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/invoice";

interface BadgeProps {
  status?: InvoiceStatus;
  className?: string;
}

const statusStyles: Record<InvoiceStatus, string> = {
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  needs_review: "border-amber-200 bg-amber-100 text-amber-800",
  approved: "border-green-200 bg-green-50 text-green-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export function StatusBadge({ status, className }: BadgeProps) {
  if (!status) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function DuplicateBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700",
        className,
      )}
    >
      Possible Duplicate
    </span>
  );
}
