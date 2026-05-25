"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { buildFloorTableModules, getFloorByTableNumber } from "@/lib/floor";
import { formatDate } from "@/lib/format";
import { canUseWaiterCalls } from "@/lib/plan";
import { useAuth } from "@/hooks/use-auth";
import { resolveTableOrders, subscribeOpenTableOrders } from "@/services/table-order-service";
import { resolveWaiterCalls, subscribeActiveWaiterCalls } from "@/services/waiter-call-service";
import { FirestoreDate, TableOrder, WaiterCall } from "@/types";

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
  const [callsLoading, setCallsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeCalls, setActiveCalls] = useState<WaiterCall[]>([]);
  const [openOrders, setOpenOrders] = useState<TableOrder[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [resolvingTableNumber, setResolvingTableNumber] = useState<number | null>(null);
  const [resolvingOrderTableNumber, setResolvingOrderTableNumber] = useState<number | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenFloorNumber, setFullscreenFloorNumber] = useState<number>(1);
  const [fullscreenPageIndex, setFullscreenPageIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const fullscreenSliderRef = useRef<HTMLDivElement | null>(null);
  const pendingSignalRef = useRef(0);
  const initializedSignalRef = useRef(false);

  const isWaiterFeatureEnabled = canUseWaiterCalls(restaurant?.plan);
  const tableCount = restaurant?.tableCount ?? 0;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    notificationAudioRef.current = new Audio("/sounds/call.mp3");
    notificationAudioRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    if (!restaurant?.id || !isWaiterFeatureEnabled) {
      setCallsLoading(false);
      setActiveCalls([]);
      return;
    }

    setCallsLoading(true);

    const unsubscribe = subscribeActiveWaiterCalls(
      restaurant.id,
      (calls) => {
        setActiveCalls(calls);
        setCallsLoading(false);
      },
      () => {
        setCallsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [restaurant?.id, isWaiterFeatureEnabled]);

  useEffect(() => {
    if (!restaurant?.id || !isWaiterFeatureEnabled) {
      setOrdersLoading(false);
      setOpenOrders([]);
      return;
    }

    setOrdersLoading(true);

    const unsubscribe = subscribeOpenTableOrders(
      restaurant.id,
      (orders) => {
        setOpenOrders(orders);
        setOrdersLoading(false);
      },
      () => {
        setOrdersLoading(false);
      },
    );

    return () => unsubscribe();
  }, [restaurant?.id, isWaiterFeatureEnabled]);

  const floorModules = useMemo(() => {
    return buildFloorTableModules(
      tableCount,
      restaurant?.floorCount ?? 1,
      restaurant?.floorTableCounts ?? null,
    );
  }, [restaurant?.floorCount, restaurant?.floorTableCounts, tableCount]);

  const tableNumbers = useMemo(() => {
    return floorModules.flatMap((module) => module.tableNumbers);
  }, [floorModules]);

  const floorOptions = useMemo(() => {
    return floorModules
      .filter((module) => module.tableCount > 0)
      .map((module) => module.floorNumber);
  }, [floorModules]);

  const fullscreenFloorTableNumbers = useMemo(() => {
    return floorModules.find((module) => module.floorNumber === fullscreenFloorNumber)?.tableNumbers ?? [];
  }, [floorModules, fullscreenFloorNumber]);

  const fullscreenTablePages = useMemo(() => {
    const PAGE_SIZE = 12;
    if (fullscreenFloorTableNumbers.length === 0) {
      return [[]] as number[][];
    }

    const pages: number[][] = [];
    for (let index = 0; index < fullscreenFloorTableNumbers.length; index += PAGE_SIZE) {
      pages.push(fullscreenFloorTableNumbers.slice(index, index + PAGE_SIZE));
    }
    return pages;
  }, [fullscreenFloorTableNumbers]);

  const callsByTable = useMemo(() => {
    return activeCalls.reduce<Record<number, WaiterCall[]>>((acc, callItem) => {
      if (!callItem.isActive) {
        return acc;
      }

      if (!acc[callItem.tableNumber]) {
        acc[callItem.tableNumber] = [];
      }

      acc[callItem.tableNumber].push(callItem);
      return acc;
    }, {});
  }, [activeCalls]);

  const ordersByTable = useMemo(() => {
    return openOrders.reduce<Record<number, TableOrder[]>>((acc, orderItem) => {
      if (!acc[orderItem.tableNumber]) {
        acc[orderItem.tableNumber] = [];
      }

      acc[orderItem.tableNumber].push(orderItem);
      return acc;
    }, {});
  }, [openOrders]);

  const activeTableCount = useMemo(() => {
    const tableSet = new Set<number>();

    Object.entries(callsByTable).forEach(([tableNumber, calls]) => {
      if (calls.length > 0) {
        tableSet.add(Number(tableNumber));
      }
    });

    Object.entries(ordersByTable).forEach(([tableNumber, orders]) => {
      if (orders.length > 0) {
        tableSet.add(Number(tableNumber));
      }
    });

    return tableSet.size;
  }, [callsByTable, ordersByTable]);

  const pendingAlertCount = activeCalls.length + openOrders.length;
  const loading = callsLoading || ordersLoading;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!initializedSignalRef.current) {
      pendingSignalRef.current = pendingAlertCount;
      initializedSignalRef.current = true;
      return;
    }

    if (pendingAlertCount > pendingSignalRef.current) {
      const audio = notificationAudioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => undefined);
      }
    }

    pendingSignalRef.current = pendingAlertCount;
  }, [loading, pendingAlertCount]);

  useEffect(() => {
    if (!isFullscreenOpen) {
      return;
    }

    if (floorOptions.length === 0) {
      setFullscreenFloorNumber(1);
      return;
    }

    if (!floorOptions.includes(fullscreenFloorNumber)) {
      setFullscreenFloorNumber(floorOptions[0]);
    }
  }, [floorOptions, fullscreenFloorNumber, isFullscreenOpen]);

  useEffect(() => {
    if (!isFullscreenOpen) {
      return;
    }

    setFullscreenPageIndex(0);
    const slider = fullscreenSliderRef.current;
    if (slider) {
      slider.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [fullscreenFloorNumber, isFullscreenOpen]);

  useEffect(() => {
    if (!isFullscreenOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreenOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreenOpen]);

  const handleResolveTable = async (tableNumber: number) => {
    if (!restaurant?.id) {
      return;
    }

    const callIds = (callsByTable[tableNumber] ?? [])
      .filter((item) => item.isActive)
      .map((item) => item.id);
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

  const handleResolveTableOrders = async (tableNumber: number) => {
    if (!restaurant?.id) {
      return;
    }

    const orderIds = (ordersByTable[tableNumber] ?? []).map((item) => item.id);
    if (orderIds.length === 0) {
      return;
    }

    setResolvingOrderTableNumber(tableNumber);
    setFeedback(null);

    try {
      await resolveTableOrders(restaurant.id, orderIds);
      setFeedback({
        type: "success",
        message: `Masa ${tableNumber} siparişi kapatıldı.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Sipariş kapatılamadı.",
      });
    } finally {
      setResolvingOrderTableNumber(null);
    }
  };

  const handleFullscreenSliderScroll = () => {
    const slider = fullscreenSliderRef.current;
    if (!slider) {
      return;
    }

    const width = slider.clientWidth;
    if (width <= 0) {
      return;
    }

    const nextPage = Math.round(slider.scrollLeft / width);
    if (nextPage !== fullscreenPageIndex) {
      setFullscreenPageIndex(nextPage);
    }
  };

  const handleFullscreenPageChange = (offset: -1 | 1) => {
    const slider = fullscreenSliderRef.current;
    if (!slider) {
      return;
    }

    const nextPage = Math.max(0, Math.min(fullscreenTablePages.length - 1, fullscreenPageIndex + offset));
    setFullscreenPageIndex(nextPage);
    slider.scrollTo({
      left: nextPage * slider.clientWidth,
      behavior: "smooth",
    });
  };

  const renderTableCard = (tableNumber: number) => {
    const tableCalls = callsByTable[tableNumber] ?? [];
    const pendingCallCount = tableCalls.filter((call) => call.isActive).length;
    const hasActiveCall = pendingCallCount > 0;
    const tableOrders = ordersByTable[tableNumber] ?? [];
    const sortedTableOrders = [...tableOrders].sort(
      (a, b) => toDateMs(a.createdAt) - toDateMs(b.createdAt),
    );
    const hasOpenOrder = tableOrders.length > 0;
    const floorNumber = getFloorByTableNumber(tableNumber, floorModules);
    const latestCall = tableCalls.reduce<WaiterCall | null>((latest, current) => {
      if (!latest) {
        return current;
      }

      return toDateMs(current.requestedAt) > toDateMs(latest.requestedAt)
        ? current
        : latest;
    }, null);
    const latestOrder = sortedTableOrders.reduce<TableOrder | null>((latest, current) => {
      if (!latest) {
        return current;
      }

      return toDateMs(current.createdAt) > toDateMs(latest.createdAt)
        ? current
        : latest;
    }, null);

    return (
      <div
        className={`rounded-xl border p-4 transition ${
          hasActiveCall
            ? "border-emerald-300 bg-emerald-50 shadow-sm shadow-emerald-100"
            : hasOpenOrder
              ? "border-amber-300 bg-amber-50 shadow-sm shadow-amber-100"
              : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Masa</p>
            <p className="text-2xl font-bold text-slate-900">{tableNumber}</p>
            <p className="mt-1 text-xs text-slate-500">Kat {floorNumber}</p>
          </div>
          <span
            className={`mt-1 h-3 w-3 rounded-full ${
              hasActiveCall ? "animate-pulse bg-emerald-500" : hasOpenOrder ? "animate-pulse bg-amber-500" : "bg-slate-300"
            }`}
          />
        </div>

        <p
          key={`call-status-${tableNumber}-${pendingCallCount}-${hasActiveCall ? "active" : "idle"}-${isHydrated ? "hydrated" : "ssr"}`}
          className={`mt-3 text-sm font-semibold ${hasActiveCall ? "text-emerald-700" : "text-slate-600"}`}
        >
          {hasActiveCall ? `${pendingCallCount} bekleyen çağrı` : "Bekleyen çağrı yok"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Son çağrı: {latestCall ? formatDate(latestCall.requestedAt) : "-"}
        </p>

        <p className={`mt-3 text-sm font-semibold ${hasOpenOrder ? "text-amber-700" : "text-slate-600"}`}>
          {hasOpenOrder ? `${tableOrders.length} açık sipariş` : "Açık sipariş yok"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Son sipariş: {latestOrder ? formatDate(latestOrder.createdAt) : "-"}
        </p>

        {hasOpenOrder ? (
          <div className="mt-2 space-y-2">
            {sortedTableOrders.map((order, index) => (
              <div key={order.id} className="rounded-lg border border-amber-200 bg-amber-100/60 p-2">
                <p className="text-xs font-semibold text-amber-900">
                  Sipariş {index + 1} · {formatDate(order.createdAt)}
                </p>
                <p className="mt-1 text-xs text-slate-700">
                  {order.items.length > 0
                    ? order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")
                    : "Ürün detayı yok"}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Not: {order.note.trim().length > 0 ? order.note : "-"}
                </p>
              </div>
            ))}
          </div>
        ) : null}

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

        {hasOpenOrder ? (
          <Button
            type="button"
            variant="secondary"
            className="mt-2 w-full"
            disabled={resolvingOrderTableNumber === tableNumber}
            onClick={() => handleResolveTableOrders(tableNumber)}
          >
            {resolvingOrderTableNumber === tableNumber ? (
              <span className="inline-flex items-center gap-2">
                <Spinner /> Kapatılıyor
              </span>
            ) : (
              "Açık Siparişleri Kapat"
            )}
          </Button>
        ) : null}
      </div>
    );
  };

  if (!restaurant) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Garson Çağrı Paneli</h1>
        <p className="mt-1 text-sm text-slate-600">
          Public menüden gelen çağrı ve masa siparişleri bu ekrana anlık yansır.
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Toplam Masa</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{tableCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Aktif Masa</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{activeTableCount}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Bekleyen Toplam Çağrı</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{activeCalls.length}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Açık Sipariş</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{openOrders.length}</p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
            <Spinner /> Çağrı ve siparişler dinleniyor...
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Masa Durumları</h2>
              <p className="mt-1 text-sm text-slate-600">
                Çağrısı olan masalar yeşil, açık siparişi olan masalar sarı renkte yanar.
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={() => setIsFullscreenOpen(true)}>
              Tam Ekran
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {tableNumbers.map((tableNumber) => (
              <div key={tableNumber}>{renderTableCard(tableNumber)}</div>
            ))}
          </div>
        </Card>
      ) : null}

      {isFullscreenOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/90 p-3 sm:p-6">
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">Masa Durumları (Tam Ekran)</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Çok masa varsa sağa kaydırarak bir sonraki sayfaya geçebilirsiniz.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                onClick={() => setIsFullscreenOpen(false)}
              >
                Kapat
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <label htmlFor="fullscreen-floor" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                Kat
              </label>
              <select
                id="fullscreen-floor"
                value={fullscreenFloorNumber}
                onChange={(event) => setFullscreenFloorNumber(Number(event.target.value))}
                className="h-10 rounded-xl border border-white/30 bg-white/10 px-3 text-sm font-semibold text-white outline-none focus:border-emerald-400"
                disabled={floorOptions.length === 0}
              >
                {floorOptions.map((floorNumber) => (
                  <option key={floorNumber} value={floorNumber} className="text-slate-900">
                    Kat {floorNumber}
                  </option>
                ))}
              </select>
              <span className="text-sm text-slate-200">
                Sayfa {fullscreenPageIndex + 1}/{fullscreenTablePages.length}
              </span>
            </div>

            <div
              ref={fullscreenSliderRef}
              onScroll={handleFullscreenSliderScroll}
              className="mt-4 flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth touch-pan-x"
            >
              {fullscreenTablePages.map((pageTableNumbers, pageIndex) => (
                <div key={`fullscreen-page-${pageIndex}`} className="w-full shrink-0 snap-start">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pageTableNumbers.map((tableNumber) => (
                      <div key={`fullscreen-table-${tableNumber}`}>{renderTableCard(tableNumber)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {fullscreenTablePages.length > 1 ? (
              <div className="mt-3 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  disabled={fullscreenPageIndex === 0}
                  onClick={() => handleFullscreenPageChange(-1)}
                >
                  Önceki
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  disabled={fullscreenPageIndex >= fullscreenTablePages.length - 1}
                  onClick={() => handleFullscreenPageChange(1)}
                >
                  Sonraki
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
