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
  adminPanel: {
    tr: "Admin Paneli",
    en: "Admin Panel",
    ru: "Админ-панель",
    ar: "لوحة الإدارة",
  },
  adminOverview: {
    tr: "Genel Bakış",
    en: "Overview",
    ru: "Обзор",
    ar: "نظرة عامة",
  },
  customers: {
    tr: "Müşteriler",
    en: "Customers",
    ru: "Клиенты",
    ar: "العملاء",
  },
  systemOrders: {
    tr: "Sistem Satın Alımları",
    en: "System Purchases",
    ru: "Покупки системы",
    ar: "مشتريات النظام",
  },
  standOrders: {
    tr: "Stant Siparişleri",
    en: "Stand Orders",
    ru: "Заказы стендов",
    ar: "طلبات الحوامل",
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
  checkingSession: {
    tr: "Oturum doğrulanıyor...",
    en: "Checking session...",
    ru: "Проверка сессии...",
    ar: "جارٍ التحقق من الجلسة...",
  },
  loadingAdminPanel: {
    tr: "Admin paneli yükleniyor...",
    en: "Loading admin panel...",
    ru: "Загрузка админ-панели...",
    ar: "جارٍ تحميل لوحة الإدارة...",
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
  floor: {
    tr: "Kat",
    en: "Floor",
    ru: "Этаж",
    ar: "الطابق",
  },
  item: {
    tr: "ürün",
    en: "item",
    ru: "позиция",
    ar: "عنصر",
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
  openTableOrder: {
    tr: "Sipariş Aç",
    en: "Place Order",
    ru: "Открыть заказ",
    ar: "فتح الطلب",
  },
  addToOrder: {
    tr: "Siparişe Ekle",
    en: "Add to Order",
    ru: "Добавить в заказ",
    ar: "أضف للطلب",
  },
  tableOrderNotePlaceholder: {
    tr: "Sipariş notu (örnek: az tuzlu, soğansız).",
    en: "Order note (e.g. less salt, no onion).",
    ru: "Комментарий к заказу (например: меньше соли, без лука).",
    ar: "ملاحظة الطلب (مثال: ملح أقل، بدون بصل).",
  },
  selectAtLeastOneMenuItem: {
    tr: "Sipariş açmadan önce en az bir ürün seçin.",
    en: "Select at least one menu item before placing an order.",
    ru: "Выберите хотя бы одну позицию перед отправкой заказа.",
    ar: "اختر عنصرًا واحدًا على الأقل قبل إرسال الطلب.",
  },
  tableOrderFailed: {
    tr: "Sipariş gönderilemedi.",
    en: "Order could not be sent.",
    ru: "Не удалось отправить заказ.",
    ar: "تعذر إرسال الطلب.",
  },
} as const;

type DictionaryKey = keyof typeof dictionary;

type MenuTokenCatalog = Record<string, Record<SupportedLocale, string>>;

const MENU_LABEL_TRANSLATIONS: MenuTokenCatalog = {
  demo: {
    tr: "Demo",
    en: "Demo",
    ru: "Демо",
    ar: "تجريبي",
  },
  popular: {
    tr: "Popüler",
    en: "Popular",
    ru: "Популярное",
    ar: "الأكثر طلباً",
  },
  chefSpecial: {
    tr: "Şef Özel",
    en: "Chef's Special",
    ru: "Спецблюдо шефа",
    ar: "اختيار الشيف",
  },
  seasonal: {
    tr: "Sezonluk",
    en: "Seasonal",
    ru: "Сезонное",
    ar: "موسمي",
  },
  new: {
    tr: "Yeni",
    en: "New",
    ru: "Новинка",
    ar: "جديد",
  },
  deal: {
    tr: "Fırsat",
    en: "Deal",
    ru: "Выгодно",
    ar: "عرض",
  },
  favorite: {
    tr: "Favori",
    en: "Favorite",
    ru: "Любимое",
    ar: "مفضل",
  },
  soldOut: {
    tr: "Tükendi",
    en: "Sold Out",
    ru: "Нет в наличии",
    ar: "نفد",
  },
};

const MENU_ALLERGEN_TRANSLATIONS: MenuTokenCatalog = {
  gluten: {
    tr: "Gluten",
    en: "Gluten",
    ru: "Глютен",
    ar: "غلوتين",
  },
  egg: {
    tr: "Yumurta",
    en: "Egg",
    ru: "Яйцо",
    ar: "بيض",
  },
  dairy: {
    tr: "Süt Ürünleri",
    en: "Dairy",
    ru: "Молочные продукты",
    ar: "منتجات الألبان",
  },
  peanut: {
    tr: "Yer Fıstığı",
    en: "Peanut",
    ru: "Арахис",
    ar: "فول سوداني",
  },
  soy: {
    tr: "Soya",
    en: "Soy",
    ru: "Соя",
    ar: "صويا",
  },
  shellfish: {
    tr: "Kabuklu Deniz Ürünleri",
    en: "Shellfish",
    ru: "Ракообразные",
    ar: "محار وقشريات",
  },
  treeNuts: {
    tr: "Sert Kabuklu Kuruyemiş",
    en: "Tree Nuts",
    ru: "Орехи",
    ar: "مكسرات شجرية",
  },
  fish: {
    tr: "Balık",
    en: "Fish",
    ru: "Рыба",
    ar: "سمك",
  },
};

function normalizeMenuToken(value: string): string {
  return value.trim().toLocaleLowerCase("tr-TR").replace(/\s+/g, " ");
}

function buildTokenAliasMap(catalog: MenuTokenCatalog): Map<string, string> {
  const aliasMap = new Map<string, string>();

  for (const [tokenKey, translations] of Object.entries(catalog)) {
    for (const locale of Object.keys(translations) as SupportedLocale[]) {
      aliasMap.set(normalizeMenuToken(translations[locale]), tokenKey);
    }
  }

  return aliasMap;
}

function localizeMenuToken(
  rawValue: string,
  locale: SupportedLocale,
  catalog: MenuTokenCatalog,
  aliasMap: Map<string, string>,
): string {
  const normalized = normalizeMenuToken(rawValue);
  const tokenKey = aliasMap.get(normalized);

  if (!tokenKey) {
    return rawValue;
  }

  return catalog[tokenKey]?.[locale] ?? rawValue;
}

const menuLabelAliasMap = buildTokenAliasMap(MENU_LABEL_TRANSLATIONS);
const menuAllergenAliasMap = buildTokenAliasMap(MENU_ALLERGEN_TRANSLATIONS);

export function localizeProductLabel(label: string, locale: SupportedLocale): string {
  return localizeMenuToken(label, locale, MENU_LABEL_TRANSLATIONS, menuLabelAliasMap);
}

export function localizeAllergenName(allergen: string, locale: SupportedLocale): string {
  return localizeMenuToken(allergen, locale, MENU_ALLERGEN_TRANSLATIONS, menuAllergenAliasMap);
}

export function t(key: DictionaryKey, locale: SupportedLocale): string {
  return dictionary[key][locale] ?? dictionary[key][DEFAULT_LOCALE];
}
