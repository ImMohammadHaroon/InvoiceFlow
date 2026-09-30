"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import { isFinalStatus, statusLabel } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface InvoiceActionsProps {
  invoice: Invoice;
  onStatusChange?: (status: InvoiceStatus) => void;
}

export function InvoiceActions({
  invoice,
  onStatusChange,
}: InvoiceActionsProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<
    "approved" | "rejected" | null
  >(null);
  const [modal, setModal] = useState<"approved" | "rejected" | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const finalized = isFinalStatus(invoice.status);
  const busy = loadingAction !== null;

  const closeToast = useCallback(() => setToast(null), []);

  async function updateStatus(status: "approved" | "rejected") {
    setLoadingAction(status);
    setToast(null);

    try {
      const response = await fetch(`/api/invoices/${invoice.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error ??
            (status === "approved"
              ? "Couldn't approve invoice. Please try again."
              : "Couldn't reject invoice. Please try again."),
        );
      }

      onStatusChange?.(status);
      setModal(null);
      setToast({
        type: "success",
        text:
          status === "approved"
            ? "Invoice approved successfully"
            : "Invoice rejected successfully",
      });
      router.refresh();
    } catch (error) {
      setToast({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : status === "approved"
              ? "Couldn't approve invoice. Please try again."
              : "Couldn't reject invoice. Please try again.",
      });
    } finally {
      setLoadingAction(null);
    }
  }

  if (finalized) {
    return (
      <>
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          This invoice is already{" "}
          <span className="font-semibold text-gray-900">
            {statusLabel(invoice.status)}
          </span>
          .
        </div>
        <Toast
          open={Boolean(toast)}
          message={toast?.text ?? ""}
          type={toast?.type}
          onClose={closeToast}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex gap-3">
        <Button
          variant="danger-outline"
          onClick={() => setModal("rejected")}
          disabled={busy}
          type="button"
        >
          Reject
        </Button>
        <Button
          onClick={() => setModal("approved")}
          disabled={busy}
          type="button"
        >
          Approve
        </Button>
      </div>

      <Modal
        open={modal === "approved"}
        tone="approve"
        title="Approve Invoice"
        description={`Are you sure you want to approve ${invoice.invoiceNumber}? This will update the invoice status to Approved.`}
        confirmLabel="Approve"
        loading={loadingAction === "approved"}
        onClose={() => {
          if (!busy) setModal(null);
        }}
        onConfirm={() => updateStatus("approved")}
      />

      <Modal
        open={modal === "rejected"}
        tone="reject"
        title="Reject Invoice"
        description={`Are you sure you want to reject ${invoice.invoiceNumber}? This will update the invoice status to Rejected.`}
        confirmLabel="Reject"
        loading={loadingAction === "rejected"}
        onClose={() => {
          if (!busy) setModal(null);
        }}
        onConfirm={() => updateStatus("rejected")}
      />

      <Toast
        open={Boolean(toast)}
        message={toast?.text ?? ""}
        type={toast?.type}
        onClose={closeToast}
      />
    </>
  );
}
