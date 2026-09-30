"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  open: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({
  open,
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed right-4 top-4 z-[60] w-full max-w-sm animate-[slideIn_0.2s_ease-out]">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg",
          type === "success"
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-red-200 bg-red-50 text-red-800",
        )}
      >
        {type === "success" ? (
          <CheckCircle2 className="h-5 w-5 shrink-0" />
        ) : (
          <X className="h-5 w-5 shrink-0" />
        )}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 hover:bg-black/5"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
