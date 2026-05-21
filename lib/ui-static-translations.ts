import { LocalizedTextMap, SupportedLocale } from "@/types";

const STATIC_UI_TRANSLATIONS: Record<string, LocalizedTextMap> = {
  "Kaydet": {
    tr: "Kaydet",
    en: "Save",
    ru: "Сохранить",
    ar: "حفظ",
  },
  "İptal": {
    tr: "İptal",
    en: "Cancel",
    ru: "Отмена",
    ar: "إلغاء",
  },
  "Düzenle": {
    tr: "Düzenle",
    en: "Edit",
    ru: "Редактировать",
    ar: "تعديل",
  },
  "Sil": {
    tr: "Sil",
    en: "Delete",
    ru: "Удалить",
    ar: "حذف",
  },
  "Ekle": {
    tr: "Ekle",
    en: "Add",
    ru: "Добавить",
    ar: "إضافة",
  },
  "Arşivle": {
    tr: "Arşivle",
    en: "Archive",
    ru: "В архив",
    ar: "أرشفة",
  },
  "Geri Al": {
    tr: "Geri Al",
    en: "Restore",
    ru: "Восстановить",
    ar: "استعادة",
  },
  "Kalıcı Sil": {
    tr: "Kalıcı Sil",
    en: "Delete Permanently",
    ru: "Удалить навсегда",
    ar: "حذف نهائي",
  },
  "Bilgileri Güncelle": {
    tr: "Bilgileri Güncelle",
    en: "Update Details",
    ru: "Обновить данные",
    ar: "تحديث المعلومات",
  },
  "Kayıt bulunamadı": {
    tr: "Kayıt bulunamadı",
    en: "No records found",
    ru: "Записи не найдены",
    ar: "لا توجد بيانات",
  },
  "Yükleniyor": {
    tr: "Yükleniyor",
    en: "Loading",
    ru: "Загрузка",
    ar: "جارٍ التحميل",
  },
  "Kaydediliyor": {
    tr: "Kaydediliyor",
    en: "Saving",
    ru: "Сохранение",
    ar: "جارٍ الحفظ",
  },
  "Ekleniyor": {
    tr: "Ekleniyor",
    en: "Adding",
    ru: "Добавление",
    ar: "جارٍ الإضافة",
  },
  "Gönderiliyor": {
    tr: "Gönderiliyor",
    en: "Sending",
    ru: "Отправка",
    ar: "جارٍ الإرسال",
  },
  "Aktif": {
    tr: "Aktif",
    en: "Active",
    ru: "Активно",
    ar: "نشط",
  },
  "Pasif": {
    tr: "Pasif",
    en: "Inactive",
    ru: "Неактивно",
    ar: "غير نشط",
  },
  "Kategori": {
    tr: "Kategori",
    en: "Category",
    ru: "Категория",
    ar: "فئة",
  },
  "Kategoriler": {
    tr: "Kategoriler",
    en: "Categories",
    ru: "Категории",
    ar: "الفئات",
  },
  "Ürün": {
    tr: "Ürün",
    en: "Item",
    ru: "Позиция",
    ar: "عنصر",
  },
  "Ürünler": {
    tr: "Ürünler",
    en: "Items",
    ru: "Позиции",
    ar: "العناصر",
  },
  "Açıklama": {
    tr: "Açıklama",
    en: "Description",
    ru: "Описание",
    ar: "الوصف",
  },
  "Fiyat": {
    tr: "Fiyat",
    en: "Price",
    ru: "Цена",
    ar: "السعر",
  },
  "Sıra": {
    tr: "Sıra",
    en: "Order",
    ru: "Порядок",
    ar: "الترتيب",
  },
  "Başlangıç": {
    tr: "Başlangıç",
    en: "Start",
    ru: "Начало",
    ar: "البداية",
  },
  "Bitiş": {
    tr: "Bitiş",
    en: "End",
    ru: "Окончание",
    ar: "النهاية",
  },
  "Hemen": {
    tr: "Hemen",
    en: "Immediately",
    ru: "Сразу",
    ar: "فورًا",
  },
  "Süresiz": {
    tr: "Süresiz",
    en: "No end date",
    ru: "Без срока",
    ar: "بدون نهاية",
  },
  "Promosyon": {
    tr: "Promosyon",
    en: "Promotion",
    ru: "Промоакция",
    ar: "عرض ترويجي",
  },
  "Kampanya": {
    tr: "Kampanya",
    en: "Campaign",
    ru: "Кампания",
    ar: "حملة",
  },
  "Telefon": {
    tr: "Telefon",
    en: "Phone",
    ru: "Телефон",
    ar: "الهاتف",
  },
  "Adres": {
    tr: "Adres",
    en: "Address",
    ru: "Адрес",
    ar: "العنوان",
  },
  "Yetkili": {
    tr: "Yetkili",
    en: "Manager",
    ru: "Ответственный",
    ar: "المسؤول",
  },
  "Masa": {
    tr: "Masa",
    en: "Table",
    ru: "Стол",
    ar: "طاولة",
  },
  "Masa Sayısı": {
    tr: "Masa Sayısı",
    en: "Table Count",
    ru: "Количество столов",
    ar: "عدد الطاولات",
  },
  "Toplam": {
    tr: "Toplam",
    en: "Total",
    ru: "Итого",
    ar: "الإجمالي",
  },
  "İşletme": {
    tr: "İşletme",
    en: "Restaurant",
    ru: "Заведение",
    ar: "المنشأة",
  },
  "Public Menü": {
    tr: "Public Menü",
    en: "Public Menu",
    ru: "Публичное меню",
    ar: "القائمة العامة",
  },
  "Tüm Menü": {
    tr: "Tüm Menü",
    en: "All Menu",
    ru: "Все меню",
    ar: "كل القائمة",
  },
  "Alerjen": {
    tr: "Alerjen",
    en: "Allergen",
    ru: "Аллерген",
    ar: "مسبب حساسية",
  },
  "Alerjen Uyarıları": {
    tr: "Alerjen Uyarıları",
    en: "Allergen Alerts",
    ru: "Предупреждения об аллергенах",
    ar: "تنبيهات المواد المسببة للحساسية",
  },
  "Varyasyonlar": {
    tr: "Varyasyonlar",
    en: "Variations",
    ru: "Вариации",
    ar: "الخيارات",
  },
  "Varsayılan": {
    tr: "Varsayılan",
    en: "Default",
    ru: "По умолчанию",
    ar: "افتراضي",
  },
  "Arka Planı Sil": {
    tr: "Arka Planı Sil",
    en: "Delete Background",
    ru: "Удалить фон",
    ar: "حذف الخلفية",
  },
  "Galeri": {
    tr: "Galeri",
    en: "Gallery",
    ru: "Галерея",
    ar: "المعرض",
  },
  "QR Kod": {
    tr: "QR Kod",
    en: "QR Code",
    ru: "QR-код",
    ar: "رمز QR",
  },
  "Garson Çağır": {
    tr: "Garson Çağır",
    en: "Call Waiter",
    ru: "Вызвать официанта",
    ar: "استدعِ النادل",
  },
  "Sosyal Medyada Bizi Takip Edin": {
    tr: "Sosyal Medyada Bizi Takip Edin",
    en: "Follow Us on Social Media",
    ru: "Подписывайтесь на нас в соцсетях",
    ar: "تابعنا على وسائل التواصل الاجتماعي",
  },
};

export function getStaticUiTranslation(source: string, locale: SupportedLocale): string | null {
  const normalizedSource = source.trim();
  if (!normalizedSource) {
    return null;
  }

  return STATIC_UI_TRANSLATIONS[normalizedSource]?.[locale] ?? null;
}
