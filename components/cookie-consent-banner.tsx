"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface CookiePreferences {
  essential: true;
  analytics: boolean;
  updatedAt: string;
}

const COOKIE_PREFERENCE_STORAGE_KEY = "qrmenum-cookie-preferences-v1";

function parseStoredPreferences(rawValue: string | null): CookiePreferences | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<CookiePreferences>;
    if (typeof parsed.analytics !== "boolean") {
      return null;
    }

    return {
      essential: true,
      analytics: parsed.analytics,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const storedPreferences = parseStoredPreferences(localStorage.getItem(COOKIE_PREFERENCE_STORAGE_KEY));
    if (!storedPreferences) {
      setIsVisible(true);
      return;
    }

    setAnalyticsEnabled(storedPreferences.analytics);
  }, []);

  const savePreferences = (nextAnalyticsEnabled: boolean) => {
    const payload: CookiePreferences = {
      essential: true,
      analytics: nextAnalyticsEnabled,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(COOKIE_PREFERENCE_STORAGE_KEY, JSON.stringify(payload));
    setAnalyticsEnabled(nextAnalyticsEnabled);
    setIsSettingsOpen(false);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-4">
      <section className="pointer-events-auto mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.2)]">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Çerez Tercihleri</p>
        <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">Çerez kullanımını yönet</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          QR Menüm, temel site işlevleri için zorunlu çerezler kullanır. Analitik çerezleri isterseniz açabilir veya
          kapatabilirsiniz. Detaylar için{" "}
          <Link href="/privacy" className="font-semibold text-emerald-700 hover:text-emerald-600">
            Gizlilik Politikası
          </Link>{" "}
          sayfasını inceleyebilirsiniz.
        </p>

        {isSettingsOpen ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 text-sm text-slate-700">
              <label className="flex items-start gap-3">
                <input type="checkbox" checked disabled className="mt-0.5 h-4 w-4 rounded border-slate-300" />
                <span>
                  <span className="font-semibold text-slate-900">Zorunlu Çerezler</span>
                  <span className="block text-slate-600">Güvenlik, oturum ve temel fonksiyonlar için gereklidir.</span>
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300"
                />
                <span>
                  <span className="font-semibold text-slate-900">Analitik Çerezler</span>
                  <span className="block text-slate-600">Performans ölçümü ve kullanım analizi için kullanılır.</span>
                </span>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => savePreferences(analyticsEnabled)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Tercihleri Kaydet
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Geri
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => savePreferences(false)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Sadece Zorunlu
          </button>
          <button
            type="button"
            onClick={() => savePreferences(true)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Tümünü Kabul Et
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Çerez Ayarları
          </button>
        </div>
      </section>
    </div>
  );
}
