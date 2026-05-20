"use client";

import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/constants";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();

  return (
    <select
      className={cn(
        "h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
        className,
      )}
      value={locale}
      onChange={(event) => setLocale(event.target.value as (typeof SUPPORTED_LOCALES)[number])}
    >
      {SUPPORTED_LOCALES.map((item) => (
        <option key={item} value={item}>
          {LOCALE_LABELS[item]}
        </option>
      ))}
    </select>
  );
}
