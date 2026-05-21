import type { PricingCurrency } from "@/lib/request-locale";

export const USD_TRY_REFERENCE_RATE = 45;

export const SYSTEM_PLAN_PRICES_TRY = {
  Starter: { monthly: 790, annual: 7900 },
  Growth: { monthly: 1490, annual: 14900 },
  Premium: { monthly: 2490, annual: 24900 },
} as const;

export type SystemPlanName = keyof typeof SYSTEM_PLAN_PRICES_TRY;
export type BillingCycle = keyof (typeof SYSTEM_PLAN_PRICES_TRY)["Starter"];

export function resolveCurrencyFromMarket(market: "tr" | "international"): PricingCurrency {
  return market === "tr" ? "TRY" : "USD";
}

export function convertTryAmount(amountTry: number, currency: PricingCurrency): number {
  if (currency === "TRY") {
    return amountTry;
  }

  const usdRaw = amountTry / USD_TRY_REFERENCE_RATE;

  if (usdRaw >= 100) {
    return Math.max(10, Math.round(usdRaw / 10) * 10);
  }

  return Math.max(1, Math.round(usdRaw));
}

export function formatMarketPriceFromTry(amountTry: number, currency: PricingCurrency): string {
  const convertedAmount = convertTryAmount(amountTry, currency);
  const locale = currency === "TRY" ? "tr-TR" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedAmount);
}
