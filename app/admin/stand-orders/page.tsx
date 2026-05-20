"use client";

import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/format";
import { STAND_UNIT_PRICE } from "@/lib/stand-pricing";
import {
  listStandOrders,
  updateStandOrderStatus,
} from "@/services/stand-order-service";
import { StandOrder } from "@/types";

export default function AdminStandOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<StandOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const nextOrders = await listStandOrders();
      setOrders(nextOrders);
    } catch (error) {
      console.error("[AdminStandOrders] load failed:", error);
      setLoadError("Stant sipariş kayıtları yüklenemedi. Firestore admin yetkisini kontrol edin.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId: string, status: StandOrder["status"]) => {
    await updateStandOrderStatus(orderId, status);
    await load();
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-slate-900">QR Stant Siparişleri</h1>
      <p className="mt-1 text-sm text-slate-600">
        Masa sayısına göre verilen stant siparişleri (₺{STAND_UNIT_PRICE} / stant).
      </p>

      {loading ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
          <Spinner /> Siparişler yükleniyor...
        </div>
      ) : loadError ? (
        <div className="mt-4">
          <Alert variant="error">{loadError}</Alert>
        </div>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Kayıt bulunamadı.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">İşletme</th>
                <th className="px-3 py-2">Masa / Tutar</th>
                <th className="px-3 py-2">Tasarım</th>
                <th className="px-3 py-2">İletişim</th>
                <th className="px-3 py-2">Tarih</th>
                <th className="px-3 py-2">Durum</th>
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
                    <p>{order.tableCount} adet</p>
                    <p className="font-semibold">₺{order.totalPrice.toLocaleString("tr-TR")}</p>
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {order.designType === "preset" ? (
                      <span>Hazır: {order.designPreset}</span>
                    ) : order.designUploadUrl ? (
                      <a
                        href={order.designUploadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-700 underline"
                      >
                        Yüklenen Tasarım
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
                      <option value="new">Yeni</option>
                      <option value="contacted">İletişimde</option>
                      <option value="in_production">Üretimde</option>
                      <option value="shipped">Kargoda</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal</option>
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
