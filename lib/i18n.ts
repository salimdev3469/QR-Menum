import { DEFAULT_LOCALE } from "@/lib/constants";
import { SupportedLocale } from "@/types";

const dictionary = {
  appName: {
    tr: "QR Menüm",
    en: "QR Menüm",
    ru: "QR Menüm",
    ar: "QR Menüm",
  },
  login: {
    tr: "Giriş Yap",
    en: "Login",
    ru: "Вход",
    ar: "تسجيل الدخول",
  },
  register: {
    tr: "Kayıt Ol",
    en: "Register",
    ru: "Регистрация",
    ar: "إنشاء حساب",
  },
  logout: {
    tr: "Çıkış",
    en: "Logout",
    ru: "Выйти",
    ar: "تسجيل الخروج",
  },
  dashboard: {
    tr: "Panel",
    en: "Dashboard",
    ru: "Панель",
    ar: "لوحة التحكم",
  },
  restaurant: {
    tr: "İşletme",
    en: "Restaurant",
    ru: "Заведение",
    ar: "المنشأة",
  },
  categories: {
    tr: "Kategoriler",
    en: "Categories",
    ru: "Категории",
    ar: "الفئات",
  },
  menuItems: {
    tr: "Ürünler",
    en: "Menu Items",
    ru: "Позиции меню",
    ar: "عناصر القائمة",
  },
  qrCode: {
    tr: "QR Kod",
    en: "QR Code",
    ru: "QR Код",
    ar: "رمز QR",
  },
  promotions: {
    tr: "Promosyonlar",
    en: "Promotions",
    ru: "Промоакции",
    ar: "العروض",
  },
  settings: {
    tr: "Ayarlar",
    en: "Settings",
    ru: "Настройки",
    ar: "الإعدادات",
  },
  waiterCalls: {
    tr: "Garson Çağrıları",
    en: "Waiter Calls",
    ru: "Вызовы официанта",
    ar: "استدعاء النادل",
  },
  save: {
    tr: "Kaydet",
    en: "Save",
    ru: "Сохранить",
    ar: "حفظ",
  },
  cancel: {
    tr: "İptal",
    en: "Cancel",
    ru: "Отмена",
    ar: "إلغاء",
  },
  publicMenu: {
    tr: "Public Menü",
    en: "Public Menu",
    ru: "Публичное меню",
    ar: "القائمة العامة",
  },
  allMenu: {
    tr: "Tüm Menü",
    en: "All Menu",
    ru: "Все меню",
    ar: "كل القائمة",
  },
  currentlyUnavailable: {
    tr: "Şu an mevcut değil",
    en: "Currently unavailable",
    ru: "Сейчас недоступно",
    ar: "غير متاح حالياً",
  },
  closedRestaurant: {
    tr: "Bu işletme şu anda aktif değil.",
    en: "This restaurant is currently inactive.",
    ru: "Это заведение сейчас неактивно.",
    ar: "هذه المنشأة غير نشطة حالياً.",
  },
  noData: {
    tr: "Kayıt bulunamadı",
    en: "No records found",
    ru: "Записи не найдены",
    ar: "لا توجد بيانات",
  },
} as const;

type DictionaryKey = keyof typeof dictionary;

export function t(key: DictionaryKey, locale: SupportedLocale): string {
  return dictionary[key][locale] ?? dictionary[key][DEFAULT_LOCALE];
}
