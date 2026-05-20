"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/format";
import { canUseWaiterCalls } from "@/lib/plan";
import { useAuth } from "@/hooks/use-auth";
import { resolveWaiterCalls, subscribeActiveWaiterCalls } from "@/services/waiter-call-service";
import { FirestoreDate, WaiterCall } from "@/types";

function toDateMs(value: FirestoreDate): number {
  if (!value) {
    return 0;
  }

  if (typeof value === "string") {
    return new Date(value).getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "object" && "toDate" in value) {
    return value.toDate().getTime();
  }

  return 0;
}

export default function WaiterCallsPage() {
  const { restaurant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeCalls, setActiveCalls] = useState<WaiterCall[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [resolvingTableNumber, setResolvingTableNumber] = useState<number | null>(null);

  const isWaiterFeatureEnabled = canUseWaiterCalls(restaurant?.plan);
  const tableCount = restaurant?.tableCount ?? 0;

  useEffect(() => {
    if (!restaurant?.id || !isWaiterFeatureEnabled) {
      setLoading(false);
      setActiveCalls([]);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeActiveWaiterCalls(
      restaurant.id,
      (calls) => {
        setActiveCalls(calls);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [restaurant?.id, isWaiterFeatureEnabled]);

  const tableNumbers = useMemo(
    () => Array.from({ length: tableCount }, (_, index) => index + 1),
    [tableCount],
  );

  const callsByTable = useMemo(() => {
    return activeCalls.reduce<Record<number, WaiterCall[]>>((acc, callItem) => {
      if (!acc[callItem.tableNumber]) {
        acc[callItem.tableNumber] = [];
      }

      acc[callItem.tableNumber].push(callItem);
      return acc;
    }, {});
  }, [activeCalls]);

  const activeTableCount = useMemo(() => {
    return Object.values(callsByTable).filter((callItems) => callItems.length > 0).length;
  }, [callsByTable]);

  const handleResolveTable = async (tableNumber: number) => {
    if (!restaurant?.id) {
      return;
    }

    const callIds = (callsByTable[tableNumber] ?? []).map((item) => item.id);
    if (callIds.length === 0) {
      return;
    }

    setResolvingTableNumber(tableNumber);
    setFeedback(null);

    try {
      await resolveWaiterCalls(restaurant.id, callIds);
      setFeedback({
        type: "success",
        message: `Masa ${tableNumber} çağrısı kapatıldı.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Çağrı kapatılamadı.",
      });
    } finally {
      setResolvingTableNumber(null);
    }
  };

  if (!restaurant) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Garson Çağrı Paneli</h1>
        <p className="mt-1 text-sm text-slate-600">
          Public menüden gelen çağrılar bu ekrana anlık yansır.
        </p>

        {!isWaiterFeatureEnabled ? (
          <div className="mt-4 space-y-3">
            <Alert variant="info">
              Garson çağırma özelliği yalnızca Growth (Orta) ve Premium paketlerde aktiftir.
            </Alert>
            <Link
              href="/dashboard/restaurant"
              className="inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Paket Ayarına Git
            </Link>
          </div>
        ) : null}

        {isWaiterFeatureEnabled && tableCount <= 0 ? (
          <div className="mt-4 space-y-3">
            <Alert variant="info">
              Masalar henüz tanımlı değil. İşletme profilinden masa sayısını girin.
            </Alert>
            <Link
              href="/dashboard/restaurant"
              className="inline-flex rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Masa Sayısını Ayarla
            </Link>
          </div>
        ) : null}

        {isWaiterFeatureEnabled && tableCount > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Toplam Masa</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{tableCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Aktif Çağrılı Masa</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{activeTableCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Bekleyen Toplam Çağrı</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{activeCalls.length}</p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
            <Spinner /> Çağrılar dinleniyor...
          </div>
        ) : null}

        {feedback ? (
          <div className="mt-4">
            <Alert variant={feedback.type}>{feedback.message}</Alert>
          </div>
        ) : null}
      </Card>

      {isWaiterFeatureEnabled && tableCount > 0 ? (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Masa Durumları</h2>
          <p className="mt-1 text-sm text-slate-600">
            Çağrısı olan masalar yeşil renkte yanar.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {tableNumbers.map((tableNumber) => {
              const tableCalls = callsByTable[tableNumber] ?? [];
              const hasActiveCall = tableCalls.length > 0;
              const latestCall = tableCalls.reduce<WaiterCall | null>((latest, current) => {
                if (!latest) {
                  return current;
                }

                return toDateMs(current.requestedAt) > toDateMs(latest.requestedAt)
                  ? current
                  : latest;
              }, null);

              return (
                <div
                  key={tableNumber}
                  className={`rounded-xl border p-4 transition ${
                    hasActiveCall
                      ? "border-emerald-300 bg-emerald-50 shadow-sm shadow-emerald-100"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase text-slate-500">Masa</p>
                      <p className="text-2xl font-bold text-slate-900">{tableNumber}</p>
                    </div>
                    <span
                      className={`mt-1 h-3 w-3 rounded-full ${
                        hasActiveCall ? "animate-pulse bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>

                  <p className={`mt-3 text-sm font-semibold ${hasActiveCall ? "text-emerald-700" : "text-slate-600"}`}>
                    {hasActiveCall ? `${tableCalls.length} bekleyen çağrı` : "Bekleyen çağrı yok"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Son çağrı: {latestCall ? formatDate(latestCall.requestedAt) : "-"}
                  </p>

                  {hasActiveCall ? (
                    <Button
                      type="button"
                      className="mt-3 w-full"
                      disabled={resolvingTableNumber === tableNumber}
                      onClick={() => handleResolveTable(tableNumber)}
                    >
                      {resolvingTableNumber === tableNumber ? (
                        <span className="inline-flex items-center gap-2">
                          <Spinner /> Kapatılıyor
                        </span>
                      ) : (
                        "Çağrıyı Kapat"
                      )}
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
