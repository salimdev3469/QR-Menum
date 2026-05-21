"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { BrandLoadingIndicator } from "@/components/ui/brand-loading-indicator";
import { cn } from "@/lib/utils";

export const NAVIGATION_LOADING_EVENT = "qr-navigation-loading:start";

const MIN_VISIBLE_MS = 420;
const MAX_VISIBLE_MS = 2600;

export function NavigationLoadingHud() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = useMemo(() => `${pathname}?${searchParams.toString()}`, [pathname, searchParams]);

  const [isVisible, setIsVisible] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const lastRouteKeyRef = useRef(routeKey);

  useEffect(() => {
    const handleStart = () => {
      startedAtRef.current = Date.now();
      setIsVisible(true);
    };

    window.addEventListener(NAVIGATION_LOADING_EVENT, handleStart);
    return () => {
      window.removeEventListener(NAVIGATION_LOADING_EVENT, handleStart);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      lastRouteKeyRef.current = routeKey;
      return;
    }

    const hasRouteChanged = routeKey !== lastRouteKeyRef.current;
    const elapsed = startedAtRef.current ? Date.now() - startedAtRef.current : MIN_VISIBLE_MS;
    const minRemaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const hideDelay = hasRouteChanged ? minRemaining : MAX_VISIBLE_MS;

    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
      lastRouteKeyRef.current = routeKey;
    }, hideDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isVisible, routeKey]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[90] flex items-center justify-center transition duration-200",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      aria-live="polite"
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 bg-slate-950/8 backdrop-blur-[1px]" />
      <div className="relative inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 text-sm font-semibold text-slate-700 shadow-[0_18px_50px_rgba(15,23,42,0.24)]">
        <BrandLoadingIndicator className="h-6 w-6" />
        Yukleniyor...
      </div>
    </div>
  );
}
