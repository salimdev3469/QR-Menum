"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { buildPublicMenuUrl } from "@/lib/url";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardStats } from "@/services/restaurant-service";
import { DashboardStats } from "@/types";

const emptyStats: DashboardStats = {
  categoryCount: 0,
  menuItemCount: 0,
  archivedCategoryCount: 0,
  archivedMenuItemCount: 0,
  promotionCount: 0,
};

export default function DashboardPage() {
  const { restaurant } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);

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
      return "NEXT_PUBLIC_APP_URL tanımlı değil";
    }
  }, [restaurant?.slug]);

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Genel Özet</h1>
        <p className="mt-1 text-sm text-slate-600">
          İşletme profilinizin durumu ve menü içerik istatistikleri.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Aktif kategori</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.categoryCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Aktif ürün</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.menuItemCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Arşiv kategori</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.archivedCategoryCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Arşiv ürün</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.archivedMenuItemCount}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-500">Aktif promosyon</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.promotionCount}</p>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
            <Spinner /> İstatistikler yükleniyor...
          </div>
        ) : null}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Yayın Bilgisi</h2>
        <p className="mt-1 text-sm text-slate-600">Public menü linkiniz ve işletme durumu.</p>

        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-semibold text-slate-700">İşletme: </span>
            {restaurant?.name}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Durum: </span>
            {restaurant?.isActive ? "Aktif" : "Pasif"}
          </p>
          <p className="break-all">
            <span className="font-semibold text-slate-700">Public link: </span>
            {publicUrl}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Son güncelleme: </span>
            {formatDate(restaurant?.updatedAt ?? null)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/dashboard/qr"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            QR Kodunu Aç
          </Link>
          {restaurant?.slug ? (
            <Link
              href={`/menu/${restaurant.slug}`}
              target="_blank"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Public Menüyü Aç
            </Link>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
