import { normalizeLocalizedMap } from "@/lib/localized";
import { Category, MenuItem, Promotion, Restaurant } from "@/types";

export interface DemoGalleryItem {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export interface DemoPublicMenuData {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  promotions: Promotion[];
  gallery: DemoGalleryItem[];
}

const DEMO_PUBLIC_MENU_SLUGS = new Set([
  "test-menu",
  "test-qr-menu",
  "demo-public-menu",
  "ornek-restoran",
  "sample-cafe",
]);

function i18n(values: { tr: string; en: string; ru?: string; ar?: string }) {
  return normalizeLocalizedMap({
    tr: values.tr,
    en: values.en,
    ru: values.ru ?? values.en,
    ar: values.ar ?? values.en,
  });
}

const DEMO_CATEGORIES: Category[] = [
  {
    id: "demo-cat-hot",
    name: "Sıcak İçecekler",
    sortOrder: 1,
    isActive: true,
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "Sıcak İçecekler",
      en: "Hot Drinks",
      ru: "Горячие напитки",
      ar: "مشروبات ساخنة",
    }),
  },
  {
    id: "demo-cat-main",
    name: "Ana Yemekler",
    sortOrder: 2,
    isActive: true,
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "Ana Yemekler",
      en: "Main Dishes",
      ru: "Основные блюда",
      ar: "الأطباق الرئيسية",
    }),
  },
  {
    id: "demo-cat-dessert",
    name: "Tatlılar",
    sortOrder: 3,
    isActive: true,
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "Tatlılar",
      en: "Desserts",
      ru: "Десерты",
      ar: "حلويات",
    }),
  },
];

const DEMO_ITEMS: MenuItem[] = [
  {
    id: "demo-item-latte",
    categoryId: "demo-cat-hot",
    name: "Demo Latte",
    description: "NOT: Bu sayfadaki ürünler tanıtım amaçlı örnek veridir.",
    price: 185,
    discountPrice: 155,
    isDiscounted: true,
    isAvailable: true,
    sortOrder: 1,
    imageUrls: ["/customer-qr-showcase.png"],
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "Demo Latte",
      en: "Demo Latte",
      ru: "Демо латте",
      ar: "لاتيه تجريبي",
    }),
    descriptionI18n: i18n({
      tr: "NOT: Bu sayfadaki ürünler tanıtım amaçlı örnek veridir.",
      en: "NOTE: Items on this page are sample data for preview only.",
      ru: "ПРИМЕЧАНИЕ: товары на этой странице являются демонстрационными данными.",
      ar: "ملاحظة: العناصر في هذه الصفحة هي بيانات تجريبية للعرض فقط.",
    }),
    labels: ["Demo", "Popüler"],
    allergens: ["Süt Ürünleri"],
    variations: [
      {
        id: "demo-item-latte-small",
        name: "Small",
        price: 145,
        isDefault: true,
        isAvailable: true,
        sortOrder: 1,
      },
      {
        id: "demo-item-latte-large",
        name: "Large",
        price: 185,
        isDefault: false,
        isAvailable: true,
        sortOrder: 2,
      },
    ],
  },
  {
    id: "demo-item-bowl",
    categoryId: "demo-cat-main",
    name: "Izgara Tavuk Bowl",
    description: "Renkli sebzeler, tahıl tabanı ve yoğurtlu sos.",
    price: 320,
    discountPrice: null,
    isDiscounted: false,
    isAvailable: true,
    sortOrder: 2,
    imageUrls: ["/qr_stand.png"],
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "Izgara Tavuk Bowl",
      en: "Grilled Chicken Bowl",
      ru: "Боул с курицей гриль",
      ar: "وعاء دجاج مشوي",
    }),
    descriptionI18n: i18n({
      tr: "Renkli sebzeler, tahıl tabanı ve yoğurtlu sos.",
      en: "Fresh vegetables, grain base, and yogurt sauce.",
      ru: "Свежие овощи, зерновая основа и йогуртовый соус.",
      ar: "خضروات طازجة وقاعدة حبوب وصلصة زبادي.",
    }),
    labels: ["Şef Özel"],
    allergens: ["Süt Ürünleri"],
    variations: [],
  },
  {
    id: "demo-item-wrap",
    categoryId: "demo-cat-main",
    name: "Vegan Wrap",
    description: "Humus, avokado ve ızgara sebzelerle hazırlanan hafif seçenek.",
    price: 275,
    discountPrice: null,
    isDiscounted: false,
    isAvailable: true,
    sortOrder: 3,
    imageUrls: ["/customer-qr-showcase.png"],
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "Vegan Wrap",
      en: "Vegan Wrap",
      ru: "Веган-ролл",
      ar: "راب نباتي",
    }),
    descriptionI18n: i18n({
      tr: "Humus, avokado ve ızgara sebzelerle hazırlanan hafif seçenek.",
      en: "Light option with hummus, avocado, and grilled vegetables.",
      ru: "Легкий вариант с хумусом, авокадо и овощами гриль.",
      ar: "خيار خفيف مع حمص وأفوكادو وخضار مشوية.",
    }),
    labels: ["Yeni"],
    allergens: [],
    variations: [],
  },
  {
    id: "demo-item-cheesecake",
    categoryId: "demo-cat-dessert",
    name: "San Sebastian Cheesecake",
    description: "Yanında bitter sos ile servis edilir.",
    price: 210,
    discountPrice: 185,
    isDiscounted: true,
    isAvailable: true,
    sortOrder: 4,
    imageUrls: ["/qr_empty.png"],
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "San Sebastian Cheesecake",
      en: "San Sebastian Cheesecake",
      ru: "Чизкейк Сан-Себастьян",
      ar: "تشيزكيك سان سيباستيان",
    }),
    descriptionI18n: i18n({
      tr: "Yanında bitter sos ile servis edilir.",
      en: "Served with dark chocolate sauce.",
      ru: "Подается с темным шоколадным соусом.",
      ar: "يُقدّم مع صوص شوكولاتة داكنة.",
    }),
    labels: ["Fırsat"],
    allergens: ["Süt Ürünleri", "Yumurta", "Gluten"],
    variations: [],
  },
  {
    id: "demo-item-soup",
    categoryId: "demo-cat-main",
    name: "Günün Çorbası",
    description: "Stokta kalmadı örneği için pasif ürün.",
    price: 150,
    discountPrice: null,
    isDiscounted: false,
    isAvailable: false,
    sortOrder: 5,
    imageUrls: [],
    createdAt: null,
    updatedAt: null,
    isArchived: false,
    archivedAt: null,
    nameI18n: i18n({
      tr: "Günün Çorbası",
      en: "Soup of the Day",
      ru: "Суп дня",
      ar: "شوربة اليوم",
    }),
    descriptionI18n: i18n({
      tr: "Stokta kalmadı örneği için pasif ürün.",
      en: "Unavailable item example for menu preview.",
      ru: "Пример недоступного блюда для предварительного просмотра меню.",
      ar: "مثال على عنصر غير متوفر لمعاينة القائمة.",
    }),
    labels: ["Tükendi"],
    allergens: [],
    variations: [],
  },
];

const DEMO_PROMOTIONS: Promotion[] = [
  {
    id: "demo-promo-1",
    title: "Demo Kampanya",
    description: "NOT: Bu kampanya kartı public menü görünümünü göstermek için eklendi.",
    scope: "all",
    targetId: null,
    startsAt: "2025-01-01T00:00:00.000Z",
    endsAt: "2030-12-31T23:59:59.000Z",
    isActive: true,
    isArchived: false,
    createdAt: null,
    updatedAt: null,
    titleI18n: i18n({
      tr: "Demo Kampanya",
      en: "Demo Campaign",
      ru: "Демо-акция",
      ar: "حملة تجريبية",
    }),
    descriptionI18n: i18n({
      tr: "NOT: Bu kampanya kartı public menü görünümünü göstermek için eklendi.",
      en: "NOTE: This campaign card is shown to preview the public menu layout.",
      ru: "ПРИМЕЧАНИЕ: эта карточка акции добавлена для демонстрации публичного меню.",
      ar: "ملاحظة: تمت إضافة بطاقة الحملة هذه لعرض شكل القائمة العامة.",
    }),
  },
];

const DEMO_GALLERY: DemoGalleryItem[] = [
  {
    id: "demo-gallery-1",
    imageUrl: "/customer-qr-showcase.png",
    sortOrder: 1,
  },
  {
    id: "demo-gallery-2",
    imageUrl: "/qr_stand.png",
    sortOrder: 2,
  },
  {
    id: "demo-gallery-3",
    imageUrl: "/qr_empty.png",
    sortOrder: 3,
  },
];

export function getDemoPublicMenuData(slug: string): DemoPublicMenuData | null {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!DEMO_PUBLIC_MENU_SLUGS.has(normalizedSlug)) {
    return null;
  }

  return {
    restaurant: {
      id: "demo-public-menu-restaurant",
      ownerUserId: "demo-owner",
      name: "QRMenu Demo Bistro",
      managerName: "Demo Manager",
      phone: "+90 212 000 00 00",
      address: "Atatürk Cad. No:45, İstanbul",
      slug: normalizedSlug,
      logoUrl: "/icon.png",
      backgroundImageUrl: "/customer-qr-showcase.png",
      isActive: true,
      createdAt: null,
      updatedAt: null,
      nameI18n: i18n({
        tr: "QRMenu Demo Bistro",
        en: "QRMenu Demo Bistro",
        ru: "QRMenu Демо Bistro",
        ar: "QRMenu Demo Bistro",
      }),
      addressI18n: i18n({
        tr: "Atatürk Cad. No:45, İstanbul",
        en: "Ataturk Avenue No:45, Istanbul",
        ru: "пр. Ататюрка, 45, Стамбул",
        ar: "شارع أتاتورك رقم 45، إسطنبول",
      }),
      menuDesign: {
        primaryColor: "#0f766e",
        accentColor: "#f97316",
        textColor: "#0f172a",
        backgroundStyle: "light",
      },
      socialLinks: {
        instagram: "instagram.com/qrmenumapp",
        facebook: "",
        x: "",
        youtube: "",
        tiktok: "",
      },
      showGalleryOnPublic: true,
      initialPlan: "starter",
      plan: "starter",
      tableCount: 0,
    },
    categories: DEMO_CATEGORIES,
    items: DEMO_ITEMS,
    promotions: DEMO_PROMOTIONS,
    gallery: DEMO_GALLERY,
  };
}
