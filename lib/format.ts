import { FirestoreDate } from "@/types";

export function formatPrice(price: number, locale = "tr-TR", currency = "TRY") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(value: FirestoreDate): string {
  return formatDateByLocale(value, "tr-TR");
}

export function formatDateByLocale(value: FirestoreDate, locale = "tr-TR"): string {
  if (!value) {
    return "-";
  }

  if (typeof value === "string") {
    return new Date(value).toLocaleString(locale);
  }

  if (value instanceof Date) {
    return value.toLocaleString(locale);
  }

  if (typeof value === "object" && "toDate" in value) {
    return value.toDate().toLocaleString(locale);
  }

  return "-";
}
