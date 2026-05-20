"use client";

import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/format";
import {
  AdminCustomerRecord,
  listAdminCustomers,
  updateCustomerRestaurantPlan,
} from "@/services/admin-service";
import { RestaurantPlan } from "@/types";

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<AdminCustomerRecord[]>([]);
  const [updatingRestaurantId, setUpdatingRestaurantId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const nextCustomers = await listAdminCustomers();
        setCustomers(nextCustomers);
      } catch (error) {
        console.error("[AdminCustomers] load failed:", error);
        setLoadError("Müşteri verileri yüklenemedi. Firestore admin yetkisini kontrol edin.");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handlePlanChange = async (restaurantId: string, plan: RestaurantPlan) => {
    setFeedback(null);
    setUpdatingRestaurantId(restaurantId);

    try {
      await updateCustomerRestaurantPlan(restaurantId, plan);
      setCustomers((prev) =>
        prev.map((item) =>
          item.profile.restaurantId === restaurantId
            ? { ...item, restaurantPlan: plan }
            : item,
        ),
      );
      setFeedback({ type: "success", message: "Müşteri paketi güncellendi." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Paket güncellenemedi.",
      });
    } finally {
      setUpdatingRestaurantId(null);
    }
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-slate-900">Müşteriler</h1>
      <p className="mt-1 text-sm text-slate-600">Kayıt olmuş tüm restoran hesapları.</p>

      {feedback ? (
        <div className="mt-4">
          <Alert variant={feedback.type}>{feedback.message}</Alert>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
          <Spinner /> Müşteriler yükleniyor...
        </div>
      ) : loadError ? (
        <div className="mt-4">
          <Alert variant="error">{loadError}</Alert>
        </div>
      ) : customers.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Müşteri kaydı bulunamadı.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Müşteri</th>
                <th className="px-3 py-2">E-posta</th>
                <th className="px-3 py-2">Telefon</th>
                <th className="px-3 py-2">Restoran</th>
                <th className="px-3 py-2">Paket</th>
                <th className="px-3 py-2">Restaurant ID</th>
                <th className="px-3 py-2">Kayıt</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.profile.id} className="border-t border-slate-200">
                  <td className="px-3 py-2 font-semibold text-slate-900">{customer.profile.name}</td>
                  <td className="px-3 py-2 text-slate-700">{customer.profile.email}</td>
                  <td className="px-3 py-2 text-slate-700">{customer.profile.phone}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {customer.restaurantName || "-"}
                    <p className="text-xs text-slate-500">
                      {customer.tableCount} masa / {customer.restaurantIsActive ? "Aktif" : "Pasif"}
                    </p>
                  </td>
                  <td className="px-3 py-2">
                    <Select
                      value={customer.restaurantPlan}
                      disabled={updatingRestaurantId === customer.profile.restaurantId}
                      onChange={(event) =>
                        handlePlanChange(
                          customer.profile.restaurantId,
                          event.target.value as RestaurantPlan,
                        )
                      }
                    >
                      <option value="starter">Starter</option>
                      <option value="growth">Growth</option>
                      <option value="premium">Premium</option>
                    </Select>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-500">{customer.profile.restaurantId}</td>
                  <td className="px-3 py-2 text-slate-700">{formatDate(customer.profile.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
