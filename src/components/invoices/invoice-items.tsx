import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceItemsProps {
  items: InvoiceItem[];
  total: number;
}

export function InvoiceItems({ items, total }: InvoiceItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Items</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead className="border-y border-gray-100 bg-gray-50/70">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Description
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Quantity
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Unit Price
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-5 py-3.5 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-sm text-gray-700">
                    {item.quantity}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-sm text-gray-700">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-sm text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50/80">
                <td
                  colSpan={3}
                  className="px-5 py-4 text-right text-sm font-semibold text-gray-700"
                >
                  Total
                </td>
                <td className="px-5 py-4 text-right font-mono text-sm font-semibold text-gray-900">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
