import { LocalizedTextMap, SupportedLocale } from "@/types";

export const SUPPORTED_LOCALES: SupportedLocale[] = ["tr", "en", "ru", "ar"];
export const DEFAULT_LOCALE: SupportedLocale = "tr";

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  ar: "العربية",
};

export const LOCALE_TEXT_DIRECTION: Record<SupportedLocale, "ltr" | "rtl"> = {
  tr: "ltr",
  en: "ltr",
  ru: "ltr",
  ar: "rtl",
};

export const IMAGE_LIMITS = {
  MAX_WIDTH_OR_HEIGHT: 1200,
  MAX_SIZE_MB: 0.5,
  MAX_PRODUCT_IMAGES: 3,
  MAX_GALLERY_IMAGES: 10,
};

export const APP_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
};

export const EMPTY_LOCALIZED_TEXT_MAP: LocalizedTextMap = {
  tr: "",
  en: "",
  ru: "",
  ar: "",
};
