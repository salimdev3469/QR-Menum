"use client";

import { PropsWithChildren } from "react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import type { MarketingLocale } from "@/lib/request-locale";

export function MarketingPageShell({
  children,
  className = "",
  locale = "tr",
}: PropsWithChildren<{ className?: string; locale?: MarketingLocale }>) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_6%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_90%_12%,rgba(14,165,233,0.1),transparent_34%)]" />
      <MarketingHeader locale={locale} />
      <main className={`relative z-10 mx-auto w-full max-w-6xl px-4 py-10 md:py-12 ${className}`}>{children}</main>
      <MarketingFooter locale={locale} />
    </div>
  );
}
