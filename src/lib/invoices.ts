import type {
  Invoice,
  InvoiceItem,
  InvoiceNote,
  InvoiceStatus,
  InvoiceSummary,
} from "@/types/invoice";

type DbInvoice = {
  id: string;
  vendor_name: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  subtotal: number | string;
  tax: number | string;
  total: number | string;
  status: InvoiceStatus;
  is_duplicate: boolean;
  created_at?: string;
  updated_at?: string;
  invoice_items?: DbInvoiceItem[];
  invoice_notes?: DbInvoiceNote[];
};

type DbInvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number | string;
  unit_price: number | string;
  amount: number | string;
};

type DbInvoiceNote = {
  id: string;
  invoice_id: string;
  body: string;
  created_at: string;
};

function toNumber(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

export function mapInvoiceItem(row: DbInvoiceItem): InvoiceItem {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    description: row.description,
    quantity: toNumber(row.quantity),
    unitPrice: toNumber(row.unit_price),
    amount: toNumber(row.amount),
  };
}

export function mapInvoiceNote(row: DbInvoiceNote): InvoiceNote {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    body: row.body,
    createdAt: row.created_at,
  };
}

export function mapInvoice(row: DbInvoice, includeRelations = false): Invoice {
  const invoice: Invoice = {
    id: row.id,
    vendorName: row.vendor_name,
    invoiceNumber: row.invoice_number,
    invoiceDate: row.invoice_date,
    dueDate: row.due_date,
    subtotal: toNumber(row.subtotal),
    tax: toNumber(row.tax),
    total: toNumber(row.total),
    status: row.status,
    isDuplicate: row.is_duplicate,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (includeRelations) {
    if (row.invoice_items) {
      invoice.items = row.invoice_items.map(mapInvoiceItem);
    }
    if (row.invoice_notes) {
      invoice.notes = [...row.invoice_notes]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .map(mapInvoiceNote);
    } else {
      invoice.notes = [];
    }
  }

  return invoice;
}

export function buildSummary(invoices: Invoice[]): InvoiceSummary {
  return {
    total: invoices.length,
    needsReview: invoices.filter((invoice) => invoice.status === "needs_review")
      .length,
    duplicates: invoices.filter((invoice) => invoice.isDuplicate).length,
    pendingValue: invoices
      .filter(
        (invoice) =>
          invoice.status === "processing" || invoice.status === "needs_review",
      )
      .reduce((sum, invoice) => sum + invoice.total, 0),
  };
}

export function buildStatusCounts(
  invoices: Invoice[],
): Record<InvoiceStatus | "all", number> {
  return {
    all: invoices.length,
    processing: invoices.filter((invoice) => invoice.status === "processing")
      .length,
    needs_review: invoices.filter(
      (invoice) => invoice.status === "needs_review",
    ).length,
    approved: invoices.filter((invoice) => invoice.status === "approved")
      .length,
    rejected: invoices.filter((invoice) => invoice.status === "rejected")
      .length,
  };
}

export function calculateTotals(
  items: { amount: number }[],
  tax = 0,
): { subtotal: number; tax: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  return {
    subtotal,
    tax,
    total: subtotal + tax,
  };
}
