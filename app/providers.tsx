"use client";

import { PropsWithChildren, Suspense } from "react";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { UiTranslatorProvider } from "@/components/providers/ui-translator-provider";
import { NavigationLoadingHud } from "@/components/ui/navigation-loading-hud";

export function Providers({ children }: PropsWithChildren) {
  return (
    <LocaleProvider>
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
