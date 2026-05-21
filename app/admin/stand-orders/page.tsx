"use client";

import { useCallback, useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useLocale } from "@/hooks/use-locale";
import { formatDate } from "@/lib/format";
import { STAND_UNIT_PRICE } from "@/lib/stand-pricing";
import {
  listStandOrders,
  updateStandOrderStatus,
} from "@/services/stand-order-service";
import { StandOrder } from "@/types";

const STAND_ORDERS_COPY = {
  tr: {
    loadError: "Stant sipariş kayıtları yüklenemedi. Firestore admin yetkisini kontrol edin.",
    title: "QR Stant Siparişleri",
    subtitle: "Masa sayısına göre verilen stant siparişleri",
    perStand: "stant",
    loading: "Siparişler yükleniyor...",
    noRecords: "Kayıt bulunamadı.",
    business: "İşletme",
    tableAndAmount: "Masa / Tutar",
    design: "Tasarım",
    contact: "İletişim",
    date: "Tarih",
    status: "Durum",
    quantity: "adet",
    preset: "Hazır",
    uploadedDesign: "Yüklenen Tasarım",
    new: "Yeni",
    contacted: "İletişimde",
    inProduction: "Üretimde",
    shipped: "Kargoda",
    completed: "Tamamlandı",
    cancelled: "İptal",
  },
  en: {
    loadError: "Stand order records could not be loaded. Check Firestore admin permissions.",
    title: "QR Stand Orders",
    subtitle: "Stand orders placed based on table count",
    perStand: "per stand",
    loading: "Loading orders...",
    noRecords: "No records found.",
    business: "Business",
    tableAndAmount: "Tables / Amount",
    design: "Design",
    contact: "Contact",
    date: "Date",
    status: "Status",
    quantity: "units",
    preset: "Preset",
    uploadedDesign: "Uploaded Design",
    new: "New",
    contacted: "Contacted",
    inProduction: "In Production",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
  },
} as const;

export default function AdminStandOrdersPage() {
  const { locale } = useLocale();
  const copy = locale === "tr" ? STAND_ORDERS_COPY.tr : STAND_ORDERS_COPY.en;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<StandOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const nextOrders = await listStandOrders();
      setOrders(nextOrders);
    } catch (error) {
      console.error("[AdminStandOrders] load failed:", error);
      setLoadError(copy.loadError);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [copy.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleStatusChange = async (orderId: string, status: StandOrder["status"]) => {
    await updateStandOrderStatus(orderId, status);
    await load();
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-slate-900">{copy.title}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {copy.subtitle} (₺{STAND_UNIT_PRICE} / {copy.perStand}).
      </p>

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
                <th className="px-3 py-2">{copy.tableAndAmount}</th>
                <th className="px-3 py-2">{copy.design}</th>
                <th className="px-3 py-2">{copy.contact}</th>
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
                    <p>{order.tableCount} {copy.quantity}</p>
                    <p className="font-semibold">₺{order.totalPrice.toLocaleString("tr-TR")}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {order.designType === "preset" ? (
                      <span>{copy.preset}: {order.designPreset}</span>
                    ) : order.designUploadUrl ? (
                      <a
                        href={order.designUploadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-700 underline"
                      >
                        {copy.uploadedDesign}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    <p>{order.email}</p>
                    <p>{order.phone}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">{formatDate(order.createdAt)}</td>
                  <td className="px-3 py-2">
                    <Select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value as StandOrder["status"])
                      }
                    >
                      <option value="new">{copy.new}</option>
                      <option value="contacted">{copy.contacted}</option>
                      <option value="in_production">{copy.inProduction}</option>
                      <option value="shipped">{copy.shipped}</option>
                      <option value="completed">{copy.completed}</option>
                      <option value="cancelled">{copy.cancelled}</option>
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
