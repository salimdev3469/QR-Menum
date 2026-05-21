import { headers } from "next/headers";

import { SupportedLocale } from "@/types";

export type MarketingLocale = Extract<SupportedLocale, "tr" | "en">;
export type VisitorMarket = "tr" | "international";
export type PricingCurrency = "TRY" | "USD";

export interface RequestLocaleContext {
  locale: MarketingLocale;
  market: VisitorMarket;
  pricingCurrency: PricingCurrency;
}

const COUNTRY_HEADER_NAMES = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "x-country-code",
  "x-appengine-country",
] as const;

function resolveCountryCodeFromRequestHeaders(requestHeaders: Headers): string | null {
  for (const headerName of COUNTRY_HEADER_NAMES) {
    const headerValue = requestHeaders.get(headerName)?.trim();
    if (headerValue) {
      return headerValue.toUpperCase();
    }
  }

  return null;
}

function resolveLocaleFromAcceptLanguage(requestHeaders: Headers): MarketingLocale {
  const acceptLanguage = requestHeaders.get("accept-language")?.toLowerCase() ?? "";
  return acceptLanguage.startsWith("tr") ? "tr" : "en";
}

export function resolveLocaleFromRequestHeaders(requestHeaders: Headers): MarketingLocale {
  const countryCode = resolveCountryCodeFromRequestHeaders(requestHeaders);
  if (countryCode) {
    return countryCode === "TR" ? "tr" : "en";
  }

  return resolveLocaleFromAcceptLanguage(requestHeaders);
}

export function resolveVisitorMarketFromRequestHeaders(requestHeaders: Headers): VisitorMarket {
  const countryCode = resolveCountryCodeFromRequestHeaders(requestHeaders);
  if (countryCode) {
    return countryCode === "TR" ? "tr" : "international";
  }

  return resolveLocaleFromAcceptLanguage(requestHeaders) === "tr" ? "tr" : "international";
}

export function resolvePricingCurrencyFromRequestHeaders(requestHeaders: Headers): PricingCurrency {
  return resolveVisitorMarketFromRequestHeaders(requestHeaders) === "tr" ? "TRY" : "USD";
}

export function resolveRequestLocaleContextFromHeaders(requestHeaders: Headers): RequestLocaleContext {
  const locale = resolveLocaleFromRequestHeaders(requestHeaders);
  const market = resolveVisitorMarketFromRequestHeaders(requestHeaders);

  return {
    locale,
    market,
    pricingCurrency: market === "tr" ? "TRY" : "USD",
  };
}

export async function resolveRequestLocale(): Promise<MarketingLocale> {
  const requestHeaders = await headers();
  return resolveLocaleFromRequestHeaders(requestHeaders);
}

export async function resolveRequestLocaleContext(): Promise<RequestLocaleContext> {
  const requestHeaders = await headers();
  return resolveRequestLocaleContextFromHeaders(requestHeaders);
}
