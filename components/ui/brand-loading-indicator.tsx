import { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface BrandLoadingIndicatorProps {
  className?: string;
}

export function BrandLoadingIndicator({ className }: BrandLoadingIndicatorProps) {
  return (
    <span className={cn("relative inline-flex h-5 w-5 items-center justify-center", className)} aria-hidden="true">
      <span className="pointer-events-none absolute inset-[-4px] rounded-[10px] border border-emerald-300/70 qr-loader-ring" />
      <span className="inline-grid h-4 w-4 grid-cols-3 gap-[1.5px] rounded-md bg-emerald-600 p-[2px] shadow-[0_0_0_1px_rgba(5,150,105,0.16)]">
        {Array.from({ length: 9 }).map((_, index) => (
          <span
            key={index}
            className={cn("rounded-[1px] bg-white qr-loader-pixel", index % 2 !== 0 && "bg-white/55")}
            style={{ animationDelay: `${index * 70}ms` } as CSSProperties}
          />
        ))}
      </span>
    </span>
  );
}
