"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLocale } from "@/hooks/use-locale";
import { getStandModelLabel } from "@/lib/stand-products";
import {
  AdminOverview,
  getAdminOverview,
  listRecentStandOrders,
  listRecentSystemOrders,
} from "@/services/admin-service";
import { formatDate } from "@/lib/format";
import { StandOrder, SystemOrder } from "@/types";

const emptyOverview: AdminOverview = {
  customerCount: 0,
  activeRestaurantCount: 0,
  totalRestaurantCount: 0,
  menuItemCount: 0,
  standOrderCount: 0,
  newStandOrderCount: 0,
  systemOrderCount: 0,
  newSystemOrderCount: 0,
};

const ADMIN_OVERVIEW_COPY = {
  tr: {
    partialLoadError: "Bazı admin verileri yüklenemedi. Firestore admin yetkilerini kontrol edin.",
    standLoadError: "Stant siparişleri yüklenemedi. Yetki ayarlarını kontrol edin.",
    systemLoadError: "Sistem satın alımları yüklenemedi. Yetki ayarlarını kontrol edin.",
    title: "Admin Genel Bakış",
    subtitle: "Müşteri, sipariş ve sistem satış verileri.",
    totalCustomers: "Toplam müşteri",
    activeRestaurants: "Aktif restoran",
    systemPurchases: "Sistem satın alımı",
    standOrders: "Stant siparişi",
    newLabel: "Yeni",
    loading: "Veriler yükleniyor...",
    recentSystemOrders: "Son Sistem Satın Alımları",
    recentStandOrders: "Son Stant Siparişleri",
    viewAll: "Tümünü Gör",
    noRecords: "Kayıt bulunamadı.",
    annual: "Yıllık",
    monthly: "Aylık",
    table: "masa",
    standModel: "Model",
  },
  en: {
    partialLoadError: "Some admin data could not be loaded. Check Firestore admin permissions.",
    standLoadError: "Stand orders could not be loaded. Check permission settings.",
    systemLoadError: "System purchases could not be loaded. Check permission settings.",
    title: "Admin Overview",
    subtitle: "Customer, order, and system purchase metrics.",
    totalCustomers: "Total customers",
    activeRestaurants: "Active restaurants",
    systemPurchases: "System purchases",
    standOrders: "Stand orders",
    newLabel: "New",
    loading: "Loading data...",
    recentSystemOrders: "Latest System Purchases",
    recentStandOrders: "Latest Stand Orders",
    viewAll: "View All",
    noRecords: "No records found.",
    annual: "Annual",
    monthly: "Monthly",
    table: "tables",
    standModel: "Model",
  },
} as const;

export default function AdminOverviewPage() {
  const { locale } = useLocale();
  const copy = locale === "tr" ? ADMIN_OVERVIEW_COPY.tr : ADMIN_OVERVIEW_COPY.en;
  const standLocale = locale === "tr" ? "tr" : "en";
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AdminOverview>(emptyOverview);
  const [recentStandOrders, setRecentStandOrders] = useState<StandOrder[]>([]);
  const [recentSystemOrders, setRecentSystemOrders] = useState<SystemOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadError(null);

      const [overviewResult, standOrdersResult, systemOrdersResult] = await Promise.allSettled([
        getAdminOverview(),
        listRecentStandOrders(5),
        listRecentSystemOrders(5),
      ]);

      if (overviewResult.status === "fulfilled") {
        setOverview(overviewResult.value);
      } else {
        console.error("[Admin] overview load failed:", overviewResult.reason);
        setLoadError(copy.partialLoadError);
      }

      if (standOrdersResult.status === "fulfilled") {
        setRecentStandOrders(standOrdersResult.value);
      } else {
        console.error("[Admin] stand orders load failed:", standOrdersResult.reason);
        setLoadError((prev) => prev ?? copy.standLoadError);
      }

      if (systemOrdersResult.status === "fulfilled") {
        setRecentSystemOrders(systemOrdersResult.value);
      } else {
        console.error("[Admin] system orders load failed:", systemOrdersResult.reason);
        setLoadError((prev) => prev ?? copy.systemLoadError);
      }

      setLoading(false);
    })();
  }, [copy.partialLoadError, copy.standLoadError, copy.systemLoadError]);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-600">{copy.subtitle}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.totalCustomers}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.customerCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.activeRestaurants}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.activeRestaurantCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.systemPurchases}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.systemOrderCount}</p>
            <p className="text-xs text-amber-700">{copy.newLabel}: {overview.newSystemOrderCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">{copy.standOrders}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.standOrderCount}</p>
            <p className="text-xs text-amber-700">{copy.newLabel}: {overview.newStandOrderCount}</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> {copy.loading}
          </div>
        ) : null}

        {!loading && loadError ? (
          <div className="mt-4">
            <Alert variant="error">{loadError}</Alert>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{copy.recentSystemOrders}</h2>
            <Link href="/admin/system-orders" className="text-xs font-semibold text-slate-700 hover:underline">
              {copy.viewAll}
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {recentSystemOrders.length === 0 ? (
              <p className="text-sm text-slate-500">{copy.noRecords}</p>
            ) : (
              recentSystemOrders.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{item.businessName}</p>
                  <p className="text-xs text-slate-500">
                    {item.planName} / {item.billingCycle === "annual" ? copy.annual : copy.monthly}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{copy.recentStandOrders}</h2>
            <Link href="/admin/stand-orders" className="text-xs font-semibold text-slate-700 hover:underline">
              {copy.viewAll}
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {recentStandOrders.length === 0 ? (
              <p className="text-sm text-slate-500">{copy.noRecords}</p>
            ) : (
              recentStandOrders.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{item.businessName}</p>
                  <p className="text-xs text-slate-500">
                    {item.tableCount} {copy.table} / ₺{item.totalPrice.toLocaleString("tr-TR")}
                  </p>
                  <p className="text-xs text-slate-500">
                    {copy.standModel}:{" "}
                    {getStandModelLabel(
                      item.standModel === "sticker" || item.standModel === "button" ? item.standModel : "stand",
                      standLocale,
                    )}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
