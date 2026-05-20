"use client";

import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/format";
import {
  listSystemOrders,
  updateSystemOrderStatus,
} from "@/services/system-order-service";
import { SystemOrder } from "@/types";

export default function AdminSystemOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<SystemOrder[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const nextOrders = await listSystemOrders();
      setOrders(nextOrders);
    } catch (error) {
      console.error("[AdminSystemOrders] load failed:", error);
      setLoadError("Sistem satın alım kayıtları yüklenemedi. Firestore admin yetkisini kontrol edin.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId: string, status: SystemOrder["status"]) => {
    await updateSystemOrderStatus(orderId, status);
    await load();
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-slate-900">QR Menüm Sistem Satın Alımları</h1>
      <p className="mt-1 text-sm text-slate-600">
        Pricing sayfasından gelen satın alım talepleri.
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
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">İletişim</th>
                <th className="px-3 py-2">Not</th>
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
                    {order.planName} / {order.billingCycle === "annual" ? "Yıllık" : "Aylık"}
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
                      <option value="new">Yeni</option>
                      <option value="contacted">İletişimde</option>
                      <option value="won">Kazandı</option>
                      <option value="lost">Kaybedildi</option>
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
