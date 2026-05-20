import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/constants";
import { LocalizedTextMap, SupportedLocale } from "@/types";

export function emptyLocalizedMap(): LocalizedTextMap {
  return {
    tr: "",
    en: "",
    ru: "",
    ar: "",
  };
}

export function normalizeLocalizedMap(
  partial: Partial<LocalizedTextMap>,
  fallbackText = "",
): LocalizedTextMap {
  const map = emptyLocalizedMap();

  for (const locale of SUPPORTED_LOCALES) {
    map[locale] = (partial[locale] ?? fallbackText ?? "").trim();
  }

  return map;
}

export function getLocalizedText(
  map: LocalizedTextMap | undefined,
  locale: SupportedLocale,
  fallback?: string,
): string {
  if (!map) {
    return fallback ?? "";
  }

  return map[locale] || map[DEFAULT_LOCALE] || fallback || "";
}
