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

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_TEXT_DIRECTION[locale];
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((value: SupportedLocale) => {
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
