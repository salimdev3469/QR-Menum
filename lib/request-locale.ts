import { headers } from "next/headers";

import { SupportedLocale } from "@/types";

export type MarketingLocale = Extract<SupportedLocale, "tr" | "en">;

const COUNTRY_HEADER_NAMES = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
  "x-appengine-country",
] as const;

export function resolveLocaleFromRequestHeaders(requestHeaders: Headers): MarketingLocale {
  for (const headerName of COUNTRY_HEADER_NAMES) {
    const headerValue = requestHeaders.get(headerName)?.trim();
    if (!headerValue) {
      continue;
    }

    return headerValue.toUpperCase() === "TR" ? "tr" : "en";
  }

  const acceptLanguage = requestHeaders.get("accept-language")?.toLowerCase() ?? "";
  return acceptLanguage.startsWith("tr") ? "tr" : "en";
}

export async function resolveRequestLocale(): Promise<MarketingLocale> {
  const requestHeaders = await headers();
  return resolveLocaleFromRequestHeaders(requestHeaders);
}
