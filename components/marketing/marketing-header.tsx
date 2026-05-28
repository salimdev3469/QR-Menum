"use client";

import { BrandLogoLink } from "@/components/ui/brand-logo-link";
import { BrandLoadingIndicator } from "@/components/ui/brand-loading-indicator";
import { LoadingLink } from "@/components/ui/loading-link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { MARKETING_NAV_LINKS, MarketingLink } from "@/lib/marketing-content";
import { logout } from "@/services/auth-service";
import { useState } from "react";

type MarketingLocale = "tr" | "en";

interface MarketingHeaderProps {
  locale?: MarketingLocale;
}

const NAV_LINKS: Record<MarketingLocale, MarketingLink[]> = {
  tr: MARKETING_NAV_LINKS,
  en: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/stands", label: "QR Stands" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
};

const HEADER_COPY = {
  tr: {
    login: "Giriş",
    startFree: "Ücretsiz Başla",
    dashboard: "Panele Git",
    adminPanel: "Admin Paneli",
    logout: "Çıkış Yap",
    checkingSession: "Oturum kontrol ediliyor...",
    loggingOut: "Çıkış yapılıyor...",
  },
  en: {
    login: "Login",
    startFree: "Start Free",
    dashboard: "Go to Dashboard",
    adminPanel: "Admin Panel",
    logout: "Logout",
    checkingSession: "Checking session...",
    loggingOut: "Logging out...",
  },
} as const;

export function MarketingHeader({ locale }: MarketingHeaderProps) {
  const { locale: appLocale } = useLocale();
  const { loading, firebaseUser, userProfile } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const resolvedLocale: MarketingLocale = locale ?? (appLocale === "tr" ? "tr" : "en");
  const navLinks = NAV_LINKS[resolvedLocale];
  const copy = HEADER_COPY[resolvedLocale];
  const redirectingText = resolvedLocale === "tr" ? "Yonlendiriliyor..." : "Redirecting...";
  const dashboardHref = userProfile?.role === "admin" ? "/admin" : "/dashboard";

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      console.error("[MarketingHeader] Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="relative z-10 border-b border-white/60 bg-white/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <BrandLogoLink />

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((item) => (
            <LoadingLink
              key={item.href}
              href={item.href}
              className="rounded-xl border border-transparent px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-white"
              loadingText={redirectingText}
            >
              {item.label}
            </LoadingLink>
          ))}
        </nav>

        {loading ? (
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800">
            <BrandLoadingIndicator />
            {copy.checkingSession}
          </div>
        ) : firebaseUser ? (
          <div className="flex items-center gap-2">
            <LoadingLink
              href={dashboardHref}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              loadingText={redirectingText}
            >
              {userProfile?.role === "admin" ? copy.adminPanel : copy.dashboard}
            </LoadingLink>
            <Button
              type="button"
              variant="ghost"
              className="h-auto rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-70"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-busy={isLoggingOut}
            >
              {isLoggingOut ? (
                <span className="inline-flex items-center gap-2">
                  <BrandLoadingIndicator />
                  {copy.loggingOut}
                </span>
              ) : (
                copy.logout
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <LoadingLink
              href="/login"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              loadingText={redirectingText}
            >
              {copy.login}
            </LoadingLink>
            <LoadingLink
              href="/register"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              loadingText={redirectingText}
            >
              {copy.startFree}
            </LoadingLink>
          </div>
        )}
      </div>
    </header>
  );
}
