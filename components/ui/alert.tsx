import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "success" | "error" | "info";
  children: ReactNode;
}

const variantStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export function Alert({ variant = "info", children }: AlertProps) {
  return (
    <div className={cn("rounded-xl border px-3 py-2 text-sm", variantStyles[variant])}>{children}</div>
  );
}
