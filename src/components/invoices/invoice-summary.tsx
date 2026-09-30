import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatCurrencyCompact } from "@/lib/utils";
import type { InvoiceSummary } from "@/types/invoice";
import {
  AlertTriangle,
  Bell,
  FileText,
  ShieldCheck,
} from "lucide-react";

interface InvoiceSummaryCardsProps {
  summary: InvoiceSummary;
}

const cards = [
  {
    key: "total" as const,
    label: "Total Invoices",
    icon: FileText,
    iconWrap: "bg-green-50 text-green-700",
    format: (value: number) => String(value),
  },
  {
    key: "needsReview" as const,
    label: "Needs Review",
    icon: Bell,
    iconWrap: "bg-amber-50 text-amber-700",
    format: (value: number) => String(value),
  },
  {
    key: "duplicates" as const,
    label: "Duplicate",
    icon: AlertTriangle,
    iconWrap: "bg-red-50 text-red-600",
    format: (value: number) => String(value),
  },
  {
    key: "pendingValue" as const,
    label: "Total Amount",
    icon: ShieldCheck,
    iconWrap: "bg-green-50 text-green-700",
    format: (value: number) => formatCurrencyCompact(value),
  },
];

export function InvoiceSummaryCards({ summary }: InvoiceSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = summary[card.key];

        return (
          <Card key={card.key} className="shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-1">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${card.iconWrap}`}
              >
                <Icon className="h-4 w-4" />
              </span>
            </CardHeader>
            <CardContent>
              <p
                className="text-3xl font-semibold tracking-tight text-gray-900"
                title={
                  card.key === "pendingValue"
                    ? formatCurrency(value)
                    : undefined
                }
              >
                {card.format(value)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
