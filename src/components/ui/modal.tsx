"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

type ModalTone = "approve" | "reject";

interface ModalProps {
  open: boolean;
  tone: ModalTone;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function Modal({
  open,
  tone,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  const isApprove = tone === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-gray-900/40"
        onClick={() => {
          if (!loading) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={
              isApprove
                ? "flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600"
                : "flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600"
            }
          >
            {isApprove ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <AlertTriangle className="h-8 w-8" />
            )}
          </div>
          <h2
            id="modal-title"
            className="mt-4 text-lg font-semibold text-gray-900"
          >
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            type="button"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isApprove ? "primary" : "danger"}
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            {loading
              ? isApprove
                ? "Approving..."
                : "Rejecting..."
              : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
