"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
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

export default function AdminOverviewPage() {
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
        setLoadError("Bazı admin verileri yüklenemedi. Firestore admin yetkilerini kontrol edin.");
      }

      if (standOrdersResult.status === "fulfilled") {
        setRecentStandOrders(standOrdersResult.value);
      } else {
        console.error("[Admin] stand orders load failed:", standOrdersResult.reason);
        setLoadError((prev) => prev ?? "Stant siparişleri yüklenemedi. Yetki ayarlarını kontrol edin.");
      }

      if (systemOrdersResult.status === "fulfilled") {
        setRecentSystemOrders(systemOrdersResult.value);
      } else {
        console.error("[Admin] system orders load failed:", systemOrdersResult.reason);
        setLoadError((prev) => prev ?? "Sistem satın alımları yüklenemedi. Yetki ayarlarını kontrol edin.");
      }

      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Admin Genel Bakış</h1>
        <p className="mt-1 text-sm text-slate-600">
          Müşteri, sipariş ve sistem satış verileri.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Toplam müşteri</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.customerCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Aktif restoran</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.activeRestaurantCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Sistem satın alımı</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.systemOrderCount}</p>
            <p className="text-xs text-amber-700">Yeni: {overview.newSystemOrderCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Stant siparişi</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{overview.standOrderCount}</p>
            <p className="text-xs text-amber-700">Yeni: {overview.newStandOrderCount}</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
            <Spinner /> Veriler yükleniyor...
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
            <h2 className="text-lg font-semibold text-slate-900">Son Sistem Satın Alımları</h2>
            <Link href="/admin/system-orders" className="text-xs font-semibold text-slate-700 hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {recentSystemOrders.length === 0 ? (
              <p className="text-sm text-slate-500">Kayıt bulunamadı.</p>
            ) : (
              recentSystemOrders.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{item.businessName}</p>
                  <p className="text-xs text-slate-500">
                    {item.planName} / {item.billingCycle === "annual" ? "Yıllık" : "Aylık"}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Son Stant Siparişleri</h2>
            <Link href="/admin/stand-orders" className="text-xs font-semibold text-slate-700 hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {recentStandOrders.length === 0 ? (
              <p className="text-sm text-slate-500">Kayıt bulunamadı.</p>
            ) : (
              recentStandOrders.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                  <p className="font-semibold text-slate-900">{item.businessName}</p>
                  <p className="text-xs text-slate-500">
                    {item.tableCount} masa / ₺{item.totalPrice.toLocaleString("tr-TR")}
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
