"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatDateByLocale } from "@/lib/format";
import { getStarterTrialStatus, STARTER_TRIAL_DAYS } from "@/lib/trial";
import { buildPublicMenuUrl } from "@/lib/url";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { getDashboardStats } from "@/services/restaurant-service";
import { DashboardStats } from "@/types";

const emptyStats: DashboardStats = {
  categoryCount: 0,
  menuItemCount: 0,
  archivedCategoryCount: 0,
  archivedMenuItemCount: 0,
  promotionCount: 0,
};

type DashboardLocale = "tr" | "en";

const DASHBOARD_COPY = {
  tr: {
    overviewTitle: "Genel Özet",
    overviewDescription: "İşletme profilinizin durumu ve menü içerik istatistikleri.",
    activeCategory: "Aktif kategori",
    activeItem: "Aktif ürün",
    archivedCategory: "Arşiv kategori",
    archivedItem: "Arşiv ürün",
    activePromotion: "Aktif promosyon",
    statsLoading: "İstatistikler yükleniyor...",
    publishTitle: "Yayın Bilgisi",
    publishDescription: "Public menü linkiniz ve işletme durumu.",
    businessLabel: "İşletme",
    statusLabel: "Durum",
    statusActive: "Aktif",
    statusInactive: "Pasif",
    trialLabel: "Starter deneme",
    trialUnknown: "Hesaplanamadı",
    trialExpired: "Süre bitti (0 gün)",
    trialRemaining: (remainingDays: number) => `${remainingDays}/${STARTER_TRIAL_DAYS} gün kaldı`,
    publicLinkLabel: "Public link",
    updatedAtLabel: "Son güncelleme",
    openQr: "QR Kodunu Aç",
    openPublicMenu: "Public Menüyü Aç",
    appUrlMissing: "NEXT_PUBLIC_APP_URL tanımlı değil",
  },
  en: {
    overviewTitle: "Overview",
    overviewDescription: "Your restaurant profile status and menu content metrics.",
    activeCategory: "Active categories",
    activeItem: "Active items",
    archivedCategory: "Archived categories",
    archivedItem: "Archived items",
    activePromotion: "Active promotions",
    statsLoading: "Loading statistics...",
    publishTitle: "Publishing Info",
    publishDescription: "Your public menu link and restaurant status.",
    businessLabel: "Business",
    statusLabel: "Status",
    statusActive: "Active",
    statusInactive: "Inactive",
    trialLabel: "Starter trial",
    trialUnknown: "Could not calculate",
    trialExpired: "Expired (0 days)",
    trialRemaining: (remainingDays: number) => `${remainingDays}/${STARTER_TRIAL_DAYS} days left`,
    publicLinkLabel: "Public link",
    updatedAtLabel: "Last updated",
    openQr: "Open QR Code",
    openPublicMenu: "Open Public Menu",
    appUrlMissing: "NEXT_PUBLIC_APP_URL is not defined",
  },
} as const;

export default function DashboardPage() {
  const { locale } = useLocale();
  const { restaurant } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const dashboardLocale: DashboardLocale = locale === "tr" ? "tr" : "en";
  const copy = DASHBOARD_COPY[dashboardLocale];

  useEffect(() => {
    if (!restaurant?.id) {
      setLoading(false);
      return;
    }

    let mounted = true;

    (async () => {
      setLoading(true);
      const nextStats = await getDashboardStats(restaurant.id);
      if (mounted) {
        setStats(nextStats);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [restaurant?.id]);

  const publicUrl = useMemo(() => {
    if (!restaurant?.slug) {
      return "";
    }

    try {
      return buildPublicMenuUrl(restaurant.slug);
    } catch {
      return copy.appUrlMissing;
    }
  }, [copy.appUrlMissing, restaurant?.slug]);

  const starterTrial = useMemo(() => {
    return getStarterTrialStatus(restaurant?.initialPlan, restaurant?.createdAt ?? null);
  }, [restaurant?.createdAt, restaurant?.initialPlan]);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">{copy.overviewTitle}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {copy.overviewDescription}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.activeCategory}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.categoryCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.activeItem}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.menuItemCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.archivedCategory}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.archivedCategoryCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.archivedItem}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.archivedMenuItemCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.activePromotion}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.promotionCount}</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
            <Spinner /> {copy.statsLoading}
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">{copy.publishTitle}</h2>
        <p className="mt-1 text-sm text-slate-600">{copy.publishDescription}</p>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-semibold text-slate-700">{copy.businessLabel}: </span>
            {restaurant?.name}
          </p>
          <p>
            <span className="font-semibold text-slate-700">{copy.statusLabel}: </span>
            {restaurant?.isActive ? copy.statusActive : copy.statusInactive}
          </p>
          <p>
            <span className="font-semibold text-slate-700">{copy.trialLabel}: </span>
            {!starterTrial.isApplicable ? (
              "-"
            ) : starterTrial.remainingDays === null ? (
              copy.trialUnknown
            ) : starterTrial.isExpired ? (
              copy.trialExpired
            ) : (
              copy.trialRemaining(starterTrial.remainingDays)
            )}
          </p>
          <p className="break-all">
            <span className="font-semibold text-slate-700">{copy.publicLinkLabel}: </span>
            {publicUrl}
          </p>
          <p>
            <span className="font-semibold text-slate-700">{copy.updatedAtLabel}: </span>
            {formatDateByLocale(restaurant?.updatedAt ?? null, dashboardLocale === "tr" ? "tr-TR" : "en-US")}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/dashboard/qr"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {copy.openQr}
          </Link>
          {restaurant?.slug ? (
            <Link
              href={`/menu/${restaurant.slug}`}
              target="_blank"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              {copy.openPublicMenu}
            </Link>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
