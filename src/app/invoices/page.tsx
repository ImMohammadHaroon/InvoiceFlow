import { AppShell } from "@/components/layout/app-shell";
import { InvoiceSummaryCards } from "@/components/invoices/invoice-summary";
import { InvoiceTabs } from "@/components/invoices/invoice-tabs";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { Card } from "@/components/ui/card";
import { listInvoices } from "@/lib/invoice-service";
import { invoiceStatusSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function InvoicesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const parsedStatus = params.status
    ? invoiceStatusSchema.safeParse(params.status)
    : null;

  if (params.status && (!parsedStatus || !parsedStatus.success)) {
    redirect("/invoices");
  }

  const status = parsedStatus?.success ? parsedStatus.data : undefined;
  const query = params.q?.trim().toLowerCase() ?? "";

  let result;
  let errorMessage: string | null = null;

  try {
    result = await listInvoices(status);
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to fetch invoices. Confirm Supabase is configured and seeded.";
  }

  const invoices =
    result && query
      ? result.data.filter((invoice) => {
          const haystack = [
            invoice.vendorName,
            invoice.invoiceNumber,
            invoice.status,
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(query);
        })
      : result?.data ?? [];

  return (
    <AppShell counts={result?.counts}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Invoices
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve construction invoices
          </p>
        </div>

        {errorMessage || !result ? (
          <Card className="px-6 py-10 text-center">
            <p className="font-medium text-gray-900">Couldn&apos;t load invoices</p>
            <p className="mt-2 text-sm text-gray-600">
              {errorMessage ?? "Unknown error"}
            </p>
          </Card>
        ) : (
          <>
            <InvoiceSummaryCards summary={result.summary} />
            <InvoiceTabs
              active={status ?? "all"}
              counts={result.counts}
              searchQuery={params.q?.trim()}
            />
            <InvoiceTable invoices={invoices} filter={status ?? "all"} />
          </>
        )}
      </div>
    </AppShell>
  );
}
