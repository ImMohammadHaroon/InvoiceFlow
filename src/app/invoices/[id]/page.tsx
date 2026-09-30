import { AppShell } from "@/components/layout/app-shell";
import { InvoiceDetailView } from "@/components/invoices/invoice-detail-view";
import { Card } from "@/components/ui/card";
import { getInvoiceById, listInvoices } from "@/lib/invoice-service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;

  let invoice = null;
  let counts;
  let errorMessage: string | null = null;

  try {
    const [detail, list] = await Promise.all([
      getInvoiceById(id),
      listInvoices().catch(() => null),
    ]);
    invoice = detail?.data ?? null;
    counts = list?.counts;
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to fetch invoice details.";
  }

  if (!errorMessage && !invoice) {
    notFound();
  }

  return (
    <AppShell counts={counts}>
      {errorMessage || !invoice ? (
        <Card className="px-6 py-10 text-center">
          <p className="font-medium text-gray-900">Couldn&apos;t load invoice</p>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage ?? "Invoice not found"}
          </p>
        </Card>
      ) : (
        <InvoiceDetailView invoice={invoice} />
      )}
    </AppShell>
  );
}
