import { DashboardSkeleton } from "@/components/invoices/skeletons";

export default function InvoicesLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] lg:pl-64">
      <div className="h-16 border-b border-gray-200 bg-white" />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
