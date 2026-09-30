import { InvoiceRow } from "@/components/invoices/invoice-row";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDateShort, statusLabel } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import Link from "next/link";

interface InvoiceTableProps {
  invoices: Invoice[];
  filter: InvoiceStatus | "all";
}

export function InvoiceTable({ invoices, filter }: InvoiceTableProps) {
  if (invoices.length === 0) {
    const label =
      filter === "all"
        ? "invoices"
        : `${statusLabel(filter).toLowerCase()} invoices`;

    return (
      <Card className="px-6 py-16 text-center">
        <p className="text-base font-medium text-gray-900">No {label}</p>
        <p className="mt-2 text-sm text-gray-500">
          {filter === "all"
            ? "Invoices will appear here once seeded."
            : `${statusLabel(filter)} invoices will appear here.`}
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="border-b border-gray-200 bg-gray-50/80">
              <tr>
                {[
                  "Vendor",
                  "Invoice #",
                  "Date",
                  "Due Date",
                  "Total",
                  "Status",
                  "Duplicate",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                      heading === "Total" ? "text-right" : ""
                    } ${heading === "Date" ? "hidden md:table-cell" : ""} ${
                      heading === "Due Date" ? "hidden lg:table-cell" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-3 md:hidden">
        {invoices.map((invoice) => (
          <Link key={invoice.id} href={`/invoices/${invoice.id}`}>
            <Card className="p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {invoice.vendorName}
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-600">
                    {invoice.invoiceNumber}
                  </p>
                </div>
                <p className="font-mono text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.total)}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={invoice.status} />
                {invoice.isDuplicate ? (
                  <span className="text-xs font-medium text-red-600">
                    Duplicate
                  </span>
                ) : null}
                <span className="text-xs text-gray-500">
                  {formatDateShort(invoice.invoiceDate)}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
