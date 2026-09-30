import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import type { InvoiceStatus } from "@/types/invoice";
import type { ReactNode } from "react";
import { Suspense } from "react";

interface AppShellProps {
  children: ReactNode;
  counts?: Partial<Record<InvoiceStatus | "all", number>>;
}

export function AppShell({ children, counts }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Suspense fallback={null}>
        <AppSidebar counts={counts} />
      </Suspense>
      <div className="lg:pl-64">
        <Suspense fallback={null}>
          <AppTopbar />
        </Suspense>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
