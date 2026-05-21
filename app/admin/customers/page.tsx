"use client";

import { useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useLocale } from "@/hooks/use-locale";
import { formatDate } from "@/lib/format";
import { getStarterTrialStatus, STARTER_TRIAL_DAYS } from "@/lib/trial";
import {
  AdminCustomerRecord,
  listAdminCustomers,
  updateCustomerRestaurantPlan,
} from "@/services/admin-service";
import { RestaurantPlan } from "@/types";

const CUSTOMER_PAGE_COPY = {
  tr: {
    loadError: "Müşteri verileri yüklenemedi. Firestore admin yetkisini kontrol edin.",
    success: "Müşteri paketi güncellendi.",
    updateError: "Paket güncellenemedi.",
    title: "Müşteriler",
    subtitle: "Kayıt olmuş tüm restoran hesapları.",
    loading: "Müşteriler yükleniyor...",
    noRecords: "Müşteri kaydı bulunamadı.",
    customer: "Müşteri",
    email: "E-posta",
    phone: "Telefon",
    restaurant: "Restoran",
    plan: "Paket",
    trial: "Deneme",
    restaurantId: "Restaurant ID",
    createdAt: "Kayıt",
    table: "masa",
    active: "Aktif",
    inactive: "Pasif",
    trialUnknown: "Hesaplanamadı",
    trialExpired: "Süre bitti (0 gün)",
    dayLabel: "gün",
  },
  en: {
    loadError: "Customer data could not be loaded. Check Firestore admin permissions.",
    success: "Customer plan updated.",
    updateError: "Plan could not be updated.",
    title: "Customers",
    subtitle: "All registered restaurant accounts.",
    loading: "Loading customers...",
    noRecords: "No customer records found.",
    customer: "Customer",
    email: "Email",
    phone: "Phone",
    restaurant: "Restaurant",
    plan: "Plan",
    trial: "Trial",
    restaurantId: "Restaurant ID",
    createdAt: "Created",
    table: "tables",
    active: "Active",
    inactive: "Inactive",
    trialUnknown: "Unavailable",
    trialExpired: "Expired (0 days)",
    dayLabel: "days",
  },
} as const;

export default function AdminCustomersPage() {
  const { locale } = useLocale();
  const copy = locale === "tr" ? CUSTOMER_PAGE_COPY.tr : CUSTOMER_PAGE_COPY.en;
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
        setLoadError(copy.loadError);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [copy.loadError]);

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
      setFeedback({ type: "success", message: copy.success });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : copy.updateError,
      });
    } finally {
      setUpdatingRestaurantId(null);
    }
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-slate-900">{copy.title}</h1>
      <p className="mt-1 text-sm text-slate-600">{copy.subtitle}</p>

      {feedback ? (
        <div className="mt-4">
          <Alert variant={feedback.type}>{feedback.message}</Alert>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
          <Spinner /> {copy.loading}
        </div>
      ) : loadError ? (
        <div className="mt-4">
          <Alert variant="error">{loadError}</Alert>
        </div>
      ) : customers.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{copy.noRecords}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">{copy.customer}</th>
                <th className="px-3 py-2">{copy.email}</th>
                <th className="px-3 py-2">{copy.phone}</th>
                <th className="px-3 py-2">{copy.restaurant}</th>
                <th className="px-3 py-2">{copy.plan}</th>
                <th className="px-3 py-2">{copy.trial}</th>
                <th className="px-3 py-2">{copy.restaurantId}</th>
                <th className="px-3 py-2">{copy.createdAt}</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const trialStatus = getStarterTrialStatus(
                  customer.restaurantInitialPlan,
                  customer.restaurantCreatedAt,
                );

                return (
                  <tr key={customer.profile.id} className="border-t border-slate-200">
                    <td className="px-3 py-2 font-semibold text-slate-900">{customer.profile.name}</td>
                    <td className="px-3 py-2 text-slate-700">{customer.profile.email}</td>
                    <td className="px-3 py-2 text-slate-700">{customer.profile.phone}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {customer.restaurantName || "-"}
                      <p className="text-xs text-slate-500">
                        {customer.tableCount} {copy.table} / {customer.restaurantIsActive ? copy.active : copy.inactive}
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
                    <td className="px-3 py-2 text-slate-700">
                      {!trialStatus.isApplicable ? (
                        "-"
                      ) : trialStatus.remainingDays === null ? (
                        copy.trialUnknown
                      ) : trialStatus.isExpired ? (
                        copy.trialExpired
                      ) : (
                        `${trialStatus.remainingDays}/${STARTER_TRIAL_DAYS} ${copy.dayLabel}`
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">{customer.profile.restaurantId}</td>
                    <td className="px-3 py-2 text-slate-700">{formatDate(customer.profile.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
