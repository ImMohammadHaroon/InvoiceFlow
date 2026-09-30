export type InvoiceStatus =
  | "processing"
  | "needs_review"
  | "approved"
  | "rejected";

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceNote {
  id: string;
  invoiceId: string;
  body: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  isDuplicate: boolean;
  items?: InvoiceItem[];
  notes?: InvoiceNote[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceSummary {
  total: number;
  needsReview: number;
  duplicates: number;
  pendingValue: number;
}

export interface InvoiceListResponse {
  data: Invoice[];
  summary: InvoiceSummary;
  counts: Record<InvoiceStatus | "all", number>;
}

export interface InvoiceDetailResponse {
  data: Invoice;
}
