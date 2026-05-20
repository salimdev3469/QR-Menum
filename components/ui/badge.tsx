import { CSSProperties, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  style,
}: PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
}>) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
