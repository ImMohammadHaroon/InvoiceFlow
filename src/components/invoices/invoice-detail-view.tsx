"use client";

import { InvoiceDetails } from "@/components/invoices/invoice-details";
import { InvoiceItems } from "@/components/invoices/invoice-items";
import { NotesCard } from "@/components/invoices/notes-card";
import { VendorDetails } from "@/components/invoices/vendor-details";
import { DuplicateBadge, StatusBadge } from "@/components/ui/badge";
import type { Invoice } from "@/types/invoice";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface InvoiceDetailViewProps {
  invoice: Invoice;
}

export function InvoiceDetailView({ invoice }: InvoiceDetailViewProps) {
  return (
    <div className="space-y-6">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to invoices
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              {invoice.invoiceNumber}
            </h1>
            <StatusBadge status={invoice.status} />
            {invoice.isDuplicate ? <DuplicateBadge /> : null}
          </div>
          <p className="mt-2 text-sm text-gray-500">{invoice.vendorName}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="space-y-6">
          <InvoiceDetails invoice={invoice} />
          <InvoiceItems items={invoice.items ?? []} total={invoice.total} />
        </div>
        <div className="space-y-6">
          <VendorDetails vendorName={invoice.vendorName} />
          <NotesCard
            invoiceId={invoice.id}
            initialNotes={invoice.notes ?? []}
          />
        </div>
      </div>
    </div>
  );
}
