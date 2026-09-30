import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn("px-5 pt-5 pb-2", className)}>{children}</div>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h2 className={cn("text-base font-semibold text-gray-900", className)}>
      {children}
    </h2>
  );
}
