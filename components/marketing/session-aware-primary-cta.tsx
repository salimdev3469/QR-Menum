"use client";

import { LoadingLink } from "@/components/ui/loading-link";
import { BrandLoadingIndicator } from "@/components/ui/brand-loading-indicator";
import { useAuth } from "@/hooks/use-auth";

type MarketingLocale = "tr" | "en";

interface SessionAwarePrimaryCtaProps {
  locale: MarketingLocale;
  className: string;
  loadingText: string;
}

const CTA_COPY = {
  tr: {
    register: "Hemen Kayıt Ol",
    dashboard: "Panele Git",
    adminPanel: "Admin Paneli",
    checkingSession: "Oturum kontrol ediliyor...",
  },
  en: {
    register: "Register Now",
    dashboard: "Go to Dashboard",
    adminPanel: "Admin Panel",
    checkingSession: "Checking session...",
  },
} as const;

export function SessionAwarePrimaryCta({ locale, className, loadingText }: SessionAwarePrimaryCtaProps) {
  const { loading, firebaseUser, userProfile } = useAuth();
  const copy = CTA_COPY[locale];

  if (loading) {
    return (
      <span className={`${className} inline-flex items-center gap-2 opacity-90`} aria-busy="true">
        <BrandLoadingIndicator />
        {copy.checkingSession}
      </span>
    );
  }

  const href = firebaseUser ? (userProfile?.role === "admin" ? "/admin" : "/dashboard") : "/register";
  const label = firebaseUser
    ? userProfile?.role === "admin"
      ? copy.adminPanel
      : copy.dashboard
    : copy.register;

  return (
    <LoadingLink href={href} className={className} loadingText={loadingText}>
      {label}
    </LoadingLink>
  );
}
