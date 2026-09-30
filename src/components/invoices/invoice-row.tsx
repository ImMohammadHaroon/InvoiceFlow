import { StatusBadge } from "@/components/ui/badge";
import {
  formatCurrency,
  formatDate,
  formatDateShort,
} from "@/lib/utils";
import type { Invoice } from "@/types/invoice";
import Link from "next/link";

interface InvoiceRowProps {
  invoice: Invoice;
}

export function InvoiceRow({ invoice }: InvoiceRowProps) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80">
      <td className="px-4 py-3.5">
        <p className="font-medium text-gray-900">{invoice.vendorName}</p>
      </td>
      <td className="px-4 py-3.5 font-mono text-sm text-gray-700">
        {invoice.invoiceNumber}
      </td>
      <td className="hidden px-4 py-3.5 text-sm text-gray-600 md:table-cell">
        {formatDateShort(invoice.invoiceDate)}
      </td>
      <td className="hidden px-4 py-3.5 text-sm text-gray-600 lg:table-cell">
        {formatDate(invoice.dueDate)}
      </td>
      <td className="px-4 py-3.5 text-right font-mono text-sm font-medium text-gray-900">
        {formatCurrency(invoice.total)}
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={invoice.status} />
      </td>
      <td className="px-4 py-3.5 text-sm">
        {invoice.isDuplicate ? (
          <span className="font-medium text-red-600">Yes</span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <Link
          href={`/invoices/${invoice.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View →
        </Link>
      </td>
    </tr>
  );
}
