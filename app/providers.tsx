"use client";

import { PropsWithChildren, Suspense } from "react";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { UiTranslatorProvider } from "@/components/providers/ui-translator-provider";
import { NavigationLoadingHud } from "@/components/ui/navigation-loading-hud";
import type { MarketingLocale, VisitorMarket } from "@/lib/request-locale";

export function Providers({
  children,
  initialLocale,
  initialMarket,
}: PropsWithChildren<{ initialLocale: MarketingLocale; initialMarket: VisitorMarket }>) {
  return (
    <LocaleProvider initialLocale={initialLocale} initialMarket={initialMarket}>
      <AuthProvider>
        <UiTranslatorProvider />
        <Suspense fallback={null}>
          <NavigationLoadingHud />
        </Suspense>
        {children}
      </AuthProvider>
      <CookieConsentBanner />
    </LocaleProvider>
  );
}
