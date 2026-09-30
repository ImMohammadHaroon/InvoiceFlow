import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex flex-col items-center py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          Invoice not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-gray-600">
          The invoice you are looking for does not exist or may have been
          removed.
        </p>
        <Link href="/invoices" className="mt-6">
          <Button type="button">Back to invoices</Button>
        </Link>
      </div>
    </AppShell>
  );
}
