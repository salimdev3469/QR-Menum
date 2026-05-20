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
  loadingMenu: {
    tr: "Menü yükleniyor...",
    en: "Loading menu...",
    ru: "Загрузка меню...",
    ar: "جارٍ تحميل القائمة...",
  },
  otherCategory: {
    tr: "Diğer",
    en: "Other",
    ru: "Другое",
    ar: "أخرى",
  },
  serviceSection: {
    tr: "Servis",
    en: "Service",
    ru: "Сервис",
    ar: "الخدمة",
  },
  callWaiter: {
    tr: "Garson Çağır",
    en: "Call Waiter",
    ru: "Вызвать официанта",
    ar: "استدعِ النادل",
  },
  callWaiterDescription: {
    tr: "Masanız için anında çağrı gönderin.",
    en: "Send an instant call for your table.",
    ru: "Отправьте мгновенный вызов для вашего стола.",
    ar: "أرسل طلبًا فوريًا لطاولتك.",
  },
  table: {
    tr: "Masa",
    en: "Table",
    ru: "Стол",
    ar: "طاولة",
  },
  sending: {
    tr: "Gönderiliyor",
    en: "Sending",
    ru: "Отправка",
    ar: "جارٍ الإرسال",
  },
  tableCountNotDefined: {
    tr: "Bu işletme için masa sayısı tanımlanmadı.",
    en: "Table count is not defined for this venue.",
    ru: "Для этого заведения не задано количество столов.",
    ar: "لم يتم تحديد عدد الطاولات لهذا المكان.",
  },
  variations: {
    tr: "Varyasyonlar",
    en: "Variations",
    ru: "Вариации",
    ar: "الخيارات",
  },
  defaultOption: {
    tr: "Varsayılan",
    en: "Default",
    ru: "По умолчанию",
    ar: "افتراضي",
  },
  allergen: {
    tr: "Alerjen",
    en: "Allergen",
    ru: "Аллерген",
    ar: "مسبب حساسية",
  },
  gallery: {
    tr: "Galeri",
    en: "Gallery",
    ru: "Галерея",
    ar: "المعرض",
  },
  campaign: {
    tr: "Kampanya",
    en: "Campaign",
    ru: "Кампания",
    ar: "حملة",
  },
  followUsOnSocialMedia: {
    tr: "Sosyal Medyada Bizi Takip Edin",
    en: "Follow Us on Social Media",
    ru: "Подписывайтесь на нас в соцсетях",
    ar: "تابعنا على وسائل التواصل الاجتماعي",
  },
  invalidTableSelection: {
    tr: "Lütfen geçerli bir masa seçin.",
    en: "Please select a valid table.",
    ru: "Пожалуйста, выберите корректный стол.",
    ar: "يرجى اختيار طاولة صالحة.",
  },
  waiterCallFailed: {
    tr: "Garson çağrısı gönderilemedi.",
    en: "Waiter call could not be sent.",
    ru: "Не удалось отправить вызов официанта.",
    ar: "تعذر إرسال طلب النادل.",
  },
} as const;

type DictionaryKey = keyof typeof dictionary;

export function t(key: DictionaryKey, locale: SupportedLocale): string {
  return dictionary[key][locale] ?? dictionary[key][DEFAULT_LOCALE];
}
