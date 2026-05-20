"use client";

import { PropsWithChildren } from "react";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { UiTranslatorProvider } from "@/components/providers/ui-translator-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <LocaleProvider>
      <AuthProvider>
        <UiTranslatorProvider />
        {children}
      </AuthProvider>
      <CookieConsentBanner />
    </LocaleProvider>
  );
}
