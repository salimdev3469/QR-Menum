"use client";

import { useCallback, useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useLocale } from "@/hooks/use-locale";
import { formatDate } from "@/lib/format";
import {
  listSystemOrders,
  updateSystemOrderStatus,
} from "@/services/system-order-service";
import { SystemOrder } from "@/types";

const SYSTEM_ORDERS_COPY = {
  tr: {
    loadError: "Sistem satın alım kayıtları yüklenemedi. Firestore admin yetkisini kontrol edin.",
    title: "QR Menüm Sistem Satın Alımları",
    subtitle: "Pricing sayfasından gelen satın alım talepleri.",
    loading: "Siparişler yükleniyor...",
    noRecords: "Kayıt bulunamadı.",
    business: "İşletme",
    plan: "Plan",
    contact: "İletişim",
    note: "Not",
    date: "Tarih",
    status: "Durum",
    annual: "Yıllık",
    monthly: "Aylık",
    new: "Yeni",
    contacted: "İletişimde",
    won: "Kazandı",
    lost: "Kaybedildi",
  },
  en: {
    loadError: "System purchase records could not be loaded. Check Firestore admin permissions.",
    title: "QR Menüm System Purchases",
    subtitle: "Purchase requests submitted from the pricing page.",
    loading: "Loading orders...",
    noRecords: "No records found.",
    business: "Business",
    plan: "Plan",
    contact: "Contact",
    note: "Note",
    date: "Date",
    status: "Status",
    annual: "Annual",
    monthly: "Monthly",
    new: "New",
    contacted: "Contacted",
    won: "Won",
    lost: "Lost",
  },
} as const;

export default function AdminSystemOrdersPage() {
  const { locale } = useLocale();
  const copy = locale === "tr" ? SYSTEM_ORDERS_COPY.tr : SYSTEM_ORDERS_COPY.en;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<SystemOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const nextOrders = await listSystemOrders();
      setOrders(nextOrders);
    } catch (error) {
      console.error("[AdminSystemOrders] load failed:", error);
      setLoadError(copy.loadError);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [copy.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleStatusChange = async (orderId: string, status: SystemOrder["status"]) => {
    await updateSystemOrderStatus(orderId, status);
    await load();
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-slate-900">{copy.title}</h1>
      <p className="mt-1 text-sm text-slate-600">{copy.subtitle}</p>

      {loading ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
          <Spinner /> {copy.loading}
        </div>
      ) : loadError ? (
        <div className="mt-4">
          <Alert variant="error">{loadError}</Alert>
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{copy.noRecords}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">{copy.business}</th>
                <th className="px-3 py-2">{copy.plan}</th>
                <th className="px-3 py-2">{copy.contact}</th>
                <th className="px-3 py-2">{copy.note}</th>
                <th className="px-3 py-2">{copy.date}</th>
                <th className="px-3 py-2">{copy.status}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-200 align-top">
                  <td className="px-3 py-2">
                    <p className="font-semibold text-slate-900">{order.businessName}</p>
                    <p className="text-xs text-slate-500">{order.customerName}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {order.planName} / {order.billingCycle === "annual" ? copy.annual : copy.monthly}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{order.note || "-"}</td>
                  <td className="px-3 py-2 text-slate-700">{formatDate(order.createdAt)}</td>
                  <td className="px-3 py-2">
                    <Select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value as SystemOrder["status"])
                      }
                    >
                      <option value="new">{copy.new}</option>
                      <option value="contacted">{copy.contacted}</option>
                      <option value="won">{copy.won}</option>
                      <option value="lost">{copy.lost}</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
