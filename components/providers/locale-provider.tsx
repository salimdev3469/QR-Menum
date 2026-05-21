"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_LOCALE,
  LOCALE_TEXT_DIRECTION,
  SUPPORTED_LOCALES,
} from "@/lib/constants";
import { SupportedLocale } from "@/types";

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (value: SupportedLocale) => void;
  direction: "ltr" | "rtl";
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = "qr-menu-locale";
const MANUAL_STORAGE_KEY = "qr-menu-locale-manual";

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: PropsWithChildren<{ initialLocale?: SupportedLocale }>) {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale);
  const [hasManualPreference, setHasManualPreference] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
    const hasManual = localStorage.getItem(MANUAL_STORAGE_KEY) === "1";

    if (hasManual && stored && SUPPORTED_LOCALES.includes(stored)) {
      setHasManualPreference(true);
      setLocaleState(stored);
      return;
    }

    setHasManualPreference(false);
    setLocaleState(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    if (hasManualPreference) {
      return;
    }

    setLocaleState(initialLocale);
  }, [hasManualPreference, initialLocale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_TEXT_DIRECTION[locale];
  }, [locale]);

  const setLocale = useCallback((value: SupportedLocale) => {
    localStorage.setItem(MANUAL_STORAGE_KEY, "1");
    localStorage.setItem(STORAGE_KEY, value);
    setHasManualPreference(true);
    setLocaleState(value);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      direction: LOCALE_TEXT_DIRECTION[locale],
    }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale LocaleProvider içinde kullanılmalı.");
  }

  return context;
}
