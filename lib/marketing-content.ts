export interface MarketingLink {
  href: string;
  label: string;
}

export interface PricingPlan {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  annualNote: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
}

export interface FeatureBlock {
  title: string;
  description: string;
  bullets: string[];
}

export const MARKETING_NAV_LINKS: MarketingLink[] = [
  { href: "/features", label: "Özellikler" },
  { href: "/pricing", label: "Fiyatlandırma" },
  { href: "/blog", label: "Blog" },
  { href: "/stands", label: "QR Stant" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Starter",
    monthlyPrice: "₺790",
    annualPrice: "₺7.900",
    annualNote: "Yıllıkta 2 ay ücretsiz",
    description: "Yeni başlayan işletmeler için gerekli temel modüller.",
    features: [
      "QR menü yayını + kategori/ürün yönetimi",
      "Ürün etiketleri (Yeni, Favori, Fırsat)",
      "Temel alerjen uyarı alanları",
      "Sosyal medya hesap linkleri",
      "Standart destek",
    ],
    cta: "Starter'ı Seç",
    featured: false,
  },
  {
    name: "Growth",
    monthlyPrice: "₺1.490",
    annualPrice: "₺14.900",
    annualNote: "Yıllıkta fiyat kilidi + öncelikli destek",
    description: "Daha çok satış ve daha güçlü menü kurgusu isteyen işletmeler için.",
    features: [
      "Starter planındaki tüm özellikler",
      "Ürün varyasyonları (Boy/Seçenek bazlı fiyat)",
      "Gelişmiş alerjen uyarı modülü",
      "Marka uyumlu tasarım (renk, yazı, giriş medyası)",
      "Öncelikli destek",
    ],
    cta: "Growth'a Geç",
    featured: true,
  },
  {
    name: "Premium",
    monthlyPrice: "₺2.490",
    annualPrice: "₺24.900",
    annualNote: "Yıllıkta onboarding ve operasyon desteği",
    description: "Kampanya ve otomasyonla menü gelirini büyütmek isteyenler için.",
    features: [
      "Growth planındaki tüm özellikler",
      "Promosyon/kampanya yönetimi (zaman ayarlı gösterim)",
      "Ürün bazlı ve uygulama bazlı banner gösterimi",
      "Komut atama ve senaryo bazlı reklam akışı",
      "Öncelikli onboarding + operasyon desteği",
    ],
    cta: "Premium'u Seç",
    featured: false,
  },
];

export const PRICING_PLANS_EN: PricingPlan[] = [
  {
    name: "Starter",
    monthlyPrice: "$18",
    annualPrice: "$176",
    annualNote: "2 months free on annual billing",
    description: "Core modules for businesses just getting started.",
    features: [
      "QR menu publishing + category/item management",
      "Product labels (New, Favorite, Deal)",
      "Basic allergen warning fields",
      "Social media profile links",
      "Standard support",
    ],
    cta: "Choose Starter",
    featured: false,
  },
  {
    name: "Growth",
    monthlyPrice: "$33",
    annualPrice: "$331",
    annualNote: "Annual price lock + priority support",
    description: "For businesses aiming for more sales and stronger menu structure.",
    features: [
      "Everything in Starter",
      "Product variations (size/option-based pricing)",
      "Advanced allergen warning module",
      "Brand-aligned design (color, typography, entry media)",
      "Priority support",
    ],
    cta: "Upgrade to Growth",
    featured: true,
  },
  {
    name: "Premium",
    monthlyPrice: "$55",
    annualPrice: "$553",
    annualNote: "Annual onboarding and operations support",
    description: "For businesses growing menu revenue via campaigns and automation.",
    features: [
      "Everything in Growth",
      "Promotion/campaign management (scheduled display)",
      "Product-level and app-level banner displays",
      "Command-based and scenario-based ad flow",
      "Priority onboarding + operations support",
    ],
    cta: "Choose Premium",
    featured: false,
  },
];

export const PRICING_POLICY_ITEMS = [
  "14 gün ücretsiz deneme, kredi kartı gerektirmez.",
  "Aylık planlar taahhütsüzdür, dönem sonunda otomatik yenilenir.",
  "Yıllık planlar 12 ay fiyat kilidi sağlar ve peşin fiyat avantajı içerir.",
  "Yıllık planda erken ayrılma durumunda indirim farkı sözleşme maddesine göre tahsil edilir.",
  "Modül kapsamları seçilen pakete göre değişir ve sözleşmede açıkça belirtilir.",
  "Sözleşme ve yenileme koşulları ödeme öncesi açık onay ile gösterilir.",
];

export const PRICING_POLICY_ITEMS_EN = [
  "14-day free trial, no credit card required.",
  "Monthly plans are commitment-free and renew automatically at period end.",
  "Annual plans provide a 12-month price lock and upfront pricing advantage.",
  "For international visitors, prices are displayed in USD based on a reference TRY/USD rate.",
  "For early cancellation in annual plans, the discount difference is charged per contract terms.",
  "Module scope varies by selected plan and is clearly stated in the agreement.",
  "Contract and renewal terms are shown with explicit confirmation before payment.",
];

export const FEATURE_BLOCKS: FeatureBlock[] = [
  {
    title: "Ürün Varyasyonları",
    description:
      "Tek ürün altında boy, gramaj veya porsiyon bazlı seçenekler tanımlayın ve fiyatı otomatik yansıtın.",
    bullets: [
      "Küçük / Orta / Büyük gibi alternatifler",
      "Her varyasyonda ayrı fiyat",
      "Varsayılan seçenek belirleme",
    ],
  },
  {
    title: "Alerjen Uyarıları",
    description:
      "Alerjen bildirimlerini ürün kartında net gösterin ve müşteriye güvenli seçim deneyimi sunun.",
    bullets: ["Hazır alerjen listesi", "Özel alerjen ekleme", "Public menüde görünür uyarı"],
  },
  {
    title: "Ürün Etiketleri",
    description:
      "Şef Özel, Yeni, Fırsat gibi etiketlerle öne çıkarmak istediğiniz ürünleri belirginleştirin.",
    bullets: ["Preset etiketler", "Özel etiket ekleme", "Hızlı görsel ayrıştırma"],
  },
  {
    title: "Markaya Uygun Menü",
    description:
      "Menü renklerini markanıza göre ayarlayın; açık/koyu stil ve görsellerle bütünlüklü bir sunum hazırlayın.",
    bullets: ["Ana renk + vurgu rengi", "Açık/koyu menü stili", "Arka plan görseli yönetimi"],
  },
  {
    title: "Promosyon Yönetimi",
    description:
      "Belirli ürün, kategori veya tüm menü için tarih aralıklı kampanyalar tanımlayın.",
    bullets: ["Tarih/saat aralığı", "Kategori/ürün hedefleme", "Aktif-pasif kontrol"],
  },
  {
    title: "Sosyal Medya Etkileşimi",
    description:
      "Instagram, Facebook, X, YouTube ve TikTok linklerinizi public menüde gösterin.",
    bullets: ["Tek panelden yönetim", "Public menüde doğrudan buton", "Mobil uyumlu görünüm"],
  },
];

export const FAQ_ITEMS = [
  {
    question: "Kurulum ne kadar sürer?",
    answer: "Çoğu işletme 10 dakika içinde kayıt, profil ve ilk menü yayını tamamlar.",
  },
  {
    question: "QR kodu nasıl alıyoruz?",
    answer: "Dashboard > QR Kod sayfasında otomatik üretilir ve PNG olarak indirilebilir.",
  },
  {
    question: "Birden fazla dil destekleniyor mu?",
    answer: "Evet. Public menüde TR, EN, RU ve AR dil desteği bulunur.",
  },
  {
    question: "Teknik bilgi gerekir mi?",
    answer: "Hayır. Arayüz teknik olmayan işletme sahipleri için sade tasarlandı.",
  },
];

export const FAQ_ITEMS_EN = [
  {
    question: "How long does setup take?",
    answer: "Most businesses complete registration, profile setup, and first menu publish in 10 minutes.",
  },
  {
    question: "How do we get the QR code?",
    answer: "It is generated automatically on Dashboard > QR Code and can be downloaded as PNG.",
  },
  {
    question: "Do you support multiple languages?",
    answer: "Yes. Public menu supports TR, EN, RU, and AR.",
  },
  {
    question: "Do we need technical knowledge?",
    answer: "No. The interface is designed for non-technical business owners.",
  },
];

export const CONTACT_CHANNELS = [
  { label: "E-posta", value: "salimaka2014@gmail.com" },
  { label: "Telefon", value: "0553 351 7769" },
  { label: "Çalışma Saatleri", value: "Hafta içi 09:00 - 18:00" },
];
