import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, statusLabel } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

interface InvoiceDetailsProps {
  invoice: Invoice;
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const rows = [
    { label: "Invoice Number", value: invoice.invoiceNumber, mono: true },
    { label: "Vendor", value: invoice.vendorName },
    { label: "Invoice Date", value: formatDate(invoice.invoiceDate) },
    { label: "Due Date", value: formatDate(invoice.dueDate) },
    {
      label: "Total Amount",
      value: formatCurrency(invoice.total),
      mono: true,
      emphasize: true,
    },
    { label: "Status", value: statusLabel(invoice.status) },
    {
      label: "Duplicate",
      value: invoice.isDuplicate ? "Yes" : "No",
      danger: invoice.isDuplicate,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-gray-100">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <dt className="text-sm text-gray-500">{row.label}</dt>
              <dd
                className={
                  row.emphasize
                    ? "font-mono text-sm font-semibold text-gray-900"
                    : row.danger
                      ? "text-sm font-medium text-red-600"
                      : row.mono
                        ? "font-mono text-sm text-gray-900"
                        : "text-sm font-medium text-gray-900"
                }
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
