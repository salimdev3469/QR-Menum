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
  if (!value) {
    return "-";
  }

  if (typeof value === "string") {
    return new Date(value).toLocaleString("tr-TR");
  }

  if (value instanceof Date) {
    return value.toLocaleString("tr-TR");
  }

  if (typeof value === "object" && "toDate" in value) {
    return value.toDate().toLocaleString("tr-TR");
  }

  return "-";
}
