export interface LandingFaqItem {
  question: string;
  answer: string;
}

export interface LandingData {
  slug:
    | "qr-menu-sistemi"
    | "restoran-yonetim-sistemi"
    | "restoran-adisyon-yazilimi"
    | "dijital-menu-olusturma"
    | "garson-cagirma-sistemi";
  label: string;
  title: string;
  description: string;
  problemItems: string[];
  solutionItems: string[];
  featureItems: string[];
  comparisonTitle: string;
  comparisonRows: Array<{
    metric: string;
    legacy: string;
    qrmenum: string;
  }>;
  faq: LandingFaqItem[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export const LANDING_PAGES: LandingData[] = [
  {
    slug: "qr-menu-sistemi",
    label: "QR Menü Sistemi",
    title: "QR Menü Sistemi ile menü güncellemelerini dakikalar içinde yönetin.",
    description:
      "Restoran ve kafeler için geliştirilen QR menü sistemi; ürün, kategori, kampanya ve görsel güncellemelerini tek panelden anlık yayınlamanızı sağlar.",
    problemItems: [
      "Baskı menülerin sık değişim maliyeti",
      "Stokta olmayan ürünlerin menüde görünmeye devam etmesi",
      "Farklı şubelerde tutarsız menü içeriği",
    ],
    solutionItems: [
      "Tek panelden ürün ve fiyat güncelleme",
      "QR kod ile müşteriye anlık güncel menü sunumu",
      "Kampanya ve etiketleri kategori bazlı yönetme",
    ],
    featureItems: [
      "Kategori ve ürün yönetimi",
      "Alerjen, varyasyon ve etiket modülü",
      "Marka uyumlu menü tasarımı",
      "TR/EN/RU/AR dil desteği",
    ],
    comparisonTitle: "QR menü sistemi ile klasik menü yönetimi karşılaştırması",
    comparisonRows: [
      { metric: "Fiyat güncelleme süresi", legacy: "Saatler", qrmenum: "Dakikalar" },
      { metric: "Baskı maliyeti", legacy: "Yüksek", qrmenum: "Düşük" },
      { metric: "Kampanya yayına alma", legacy: "Manuel", qrmenum: "Panelden anlık" },
    ],
    faq: [
      {
        question: "QR menü sistemi kurulum süresi ne kadar?",
        answer: "Çoğu işletme ilk menüsünü aynı gün içinde yayına alır.",
      },
      {
        question: "QR kodu nasıl dağıtıyoruz?",
        answer: "Dashboard üzerinden PNG formatında indirip masa üstü stantlarda kullanabilirsiniz.",
      },
    ],
    primaryCtaLabel: "Ücretsiz Kayıt Ol",
    primaryCtaHref: "/register",
    secondaryCtaLabel: "Fiyatlandırmayı Gör",
    secondaryCtaHref: "/pricing",
    seoTitle: "QR Menü Sistemi: Restoranlar İçin Dijital Menü Çözümü",
    seoDescription:
      "QR Menü Sistemi ile restoran menünüzü anlık güncelleyin, kampanyaları yönetin ve müşteriye hızlı dijital deneyim sunun.",
    keywords: ["qr menü sistemi", "dijital menü", "restoran qr menü"],
  },
  {
    slug: "restoran-yonetim-sistemi",
    label: "Restoran Yönetimi",
    title: "Restoran yönetim sistemi ile menü ve operasyonu tek panelde birleştirin.",
    description:
      "Restoran yönetim sistemi yaklaşımıyla menü içerikleri, promosyonlar, masa ve çağrı akışı tek merkezden yönetilir.",
    problemItems: [
      "Operasyon verisinin farklı araçlara dağılması",
      "Ekipler arası iletişim gecikmeleri",
      "Kampanya ve içerik kontrolünün zorlaşması",
    ],
    solutionItems: [
      "Menü + operasyon akışını tek panelde toplama",
      "Hızlı görev dağılımı ve güncelleme",
      "Yönetici için merkezi görünürlük",
    ],
    featureItems: [
      "Promosyon yönetimi",
      "Garson çağrı modülü",
      "QR yayın ve içerik kontrolü",
      "Satış odaklı menü kurgusu",
    ],
    comparisonTitle: "Parçalı araçlar yerine bütünleşik yönetim",
    comparisonRows: [
      { metric: "Süreç görünürlüğü", legacy: "Düşük", qrmenum: "Yüksek" },
      { metric: "Güncelleme hatası", legacy: "Sık", qrmenum: "Daha düşük" },
      { metric: "Ekip koordinasyonu", legacy: "Dağınık", qrmenum: "Merkezi" },
    ],
    faq: [
      {
        question: "Restoran yönetim sisteminde hangi modüller var?",
        answer: "Menü yönetimi, kampanya, çağrı ve QR yayın modülleri tek panelde sunulur.",
      },
      {
        question: "Küçük işletmeler için uygun mu?",
        answer: "Evet, sade arayüz sayesinde teknik ekip gerektirmeden kullanılabilir.",
      },
    ],
    primaryCtaLabel: "Özellikleri İncele",
    primaryCtaHref: "/features",
    secondaryCtaLabel: "Satışla Görüş",
    secondaryCtaHref: "/contact",
    seoTitle: "Restoran Yönetim Sistemi",
    seoDescription:
      "Restoran yönetim sistemi ile menü, kampanya ve operasyon süreçlerini tek panelde yönetin.",
    keywords: ["restoran yönetim sistemi", "restoran operasyon yazılımı", "restoran panel"],
  },
  {
    slug: "restoran-adisyon-yazilimi",
    label: "Adisyon Yazılımı",
    title: "Restoran adisyon yazılımı seçimini satış ve hız odaklı kriterlerle yapın.",
    description:
      "Adisyon yazılımı altyapısında menü güncelleme, servis hızı ve raporlama yetkinlikleri işletme verimliliğini doğrudan etkiler.",
    problemItems: [
      "Yoğun saatlerde sipariş gecikmesi",
      "Raporlama eksikliği nedeniyle yanlış kararlar",
      "Menü ile operasyon arasında kopukluk",
    ],
    solutionItems: [
      "Hızlı panel kullanımı",
      "Kampanya ve ürün performans görünürlüğü",
      "QR menü ile entegre içerik akışı",
    ],
    featureItems: [
      "Kategori/ürün satış görünürlüğü",
      "Etiket ve kampanya yönetimi",
      "Anlık menü yayını",
      "Düşük öğrenme eğrisi",
    ],
    comparisonTitle: "Adisyon odaklı süreçlerde verim farkı",
    comparisonRows: [
      { metric: "Sipariş hazırlık başlangıcı", legacy: "Gecikmeli", qrmenum: "Hızlı" },
      { metric: "Menü-güncel fiyat uyumu", legacy: "Riskli", qrmenum: "Anlık" },
      { metric: "Rapor takibi", legacy: "Parçalı", qrmenum: "Merkezi" },
    ],
    faq: [
      {
        question: "Adisyon tarafında teknik kurulum gerekir mi?",
        answer: "Temel kullanım için teknik ekip gerekmeden panel üzerinden süreç yönetilebilir.",
      },
      {
        question: "QR menü ile birlikte çalışır mı?",
        answer: "Evet, ürün ve kampanya güncellemeleri QR menüde anlık yansıtılır.",
      },
    ],
    primaryCtaLabel: "Sistemi Satın Al",
    primaryCtaHref: "/purchase",
    secondaryCtaLabel: "Blog Rehberlerini Oku",
    secondaryCtaHref: "/blog",
    seoTitle: "Restoran Adisyon Yazılımı",
    seoDescription:
      "Restoran adisyon yazılımı seçiminde hız, görünürlük ve QR menü entegrasyonu ile operasyon verimini artırın.",
    keywords: ["restoran adisyon yazılımı", "adisyon programı", "adisyon sistemi"],
  },
  {
    slug: "dijital-menu-olusturma",
    label: "Dijital Menü",
    title: "Dijital menü oluşturma sürecini standartlaştırın ve hızlı yayına çıkın.",
    description:
      "Dijital menü oluşturma adımlarında içerik, görsel ve kategori yapısını doğru kurarak hem müşteri deneyimini hem de operasyon hızını artırın.",
    problemItems: [
      "Düzensiz kategori yapısı",
      "Düşük kaliteli ürün görselleri",
      "Kampanya içeriklerinde tutarsızlık",
    ],
    solutionItems: [
      "Standart kategori ve ürün şablonu",
      "Marka uyumlu menü tasarımı",
      "Zamanlı kampanya yönetimi",
    ],
    featureItems: [
      "Sürükle-bırak sıralama",
      "Ürün görsel yönetimi",
      "Alerjen ve etiket alanları",
      "Hızlı yayınlama",
    ],
    comparisonTitle: "Dijital menüde yapılandırılmış yaklaşımın etkisi",
    comparisonRows: [
      { metric: "Menü okunabilirliği", legacy: "Değişken", qrmenum: "Yüksek" },
      { metric: "Güncelleme maliyeti", legacy: "Yüksek", qrmenum: "Düşük" },
      { metric: "Müşteri karar süresi", legacy: "Daha uzun", qrmenum: "Daha kısa" },
    ],
    faq: [
      {
        question: "Dijital menüye geçişte ilk adım nedir?",
        answer: "Önce kategori yapısını netleştirip en çok satan ürünleri öncelikli sıraya yerleştirin.",
      },
      {
        question: "Eski menüleri aktarabilir miyiz?",
        answer: "Evet, mevcut ürünlerinizi panelde kategori bazında hızlı şekilde oluşturabilirsiniz.",
      },
    ],
    primaryCtaLabel: "Hemen Kayıt Ol",
    primaryCtaHref: "/register",
    secondaryCtaLabel: "Örnek QR Stantları Gör",
    secondaryCtaHref: "/stands",
    seoTitle: "Dijital Menü Oluşturma",
    seoDescription:
      "Dijital menü oluşturma sürecini adım adım planlayın, menünüzü anlık güncelleyin ve müşteriye hızlı deneyim sunun.",
    keywords: ["dijital menü oluşturma", "online menü", "restoran dijital menü"],
  },
  {
    slug: "garson-cagirma-sistemi",
    label: "Garson Çağrı Sistemi",
    title: "Garson çağrı sistemi ile masa taleplerini gecikmeden yönetin.",
    description:
      "Garson çağrı sistemi sayesinde müşteriden gelen masa talepleri panelde anlık görüntülenir; servis süresi daha kontrollü hale gelir.",
    problemItems: [
      "Masa çağrılarının gözden kaçması",
      "Yoğun saatlerde servis sırasının bozulması",
      "Müşteri memnuniyetinde dalgalanma",
    ],
    solutionItems: [
      "Panelde masa bazlı çağrı görünürlüğü",
      "Kat/modül bazlı yönlendirme",
      "Servis önceliğini hızlı belirleme",
    ],
    featureItems: [
      "Masa numarası bazlı çağrı",
      "Kat yönetimi desteği",
      "Durum takibi",
      "QR menü ile entegre servis akışı",
    ],
    comparisonTitle: "Geleneksel çağrı akışı ile dijital çağrı yönetimi",
    comparisonRows: [
      { metric: "Çağrı görünürlüğü", legacy: "Düşük", qrmenum: "Anlık" },
      { metric: "Yanıt süresi", legacy: "Değişken", qrmenum: "Daha tutarlı" },
      { metric: "Masa memnuniyeti", legacy: "Riskli", qrmenum: "Daha yüksek" },
    ],
    faq: [
      {
        question: "Garson çağrı sistemi nasıl çalışır?",
        answer: "Müşteri public menüdeki çağrı alanını kullanır ve çağrı panelde ilgili masa ile görünür.",
      },
      {
        question: "Katlı işletmelerde kullanılabilir mi?",
        answer: "Evet, kat modülü ile masa dağılımına göre çağrı yönetimi yapılabilir.",
      },
    ],
    primaryCtaLabel: "Demo İçin İletişim",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "Garson Çağrı Modülünü Gör",
    secondaryCtaHref: "/features",
    seoTitle: "Garson Çağrı Sistemi",
    seoDescription:
      "Garson çağrı sistemi ile masa taleplerini anlık yönetin, servis hızını artırın ve müşteri deneyimini iyileştirin.",
    keywords: ["garson çağrı sistemi", "masa çağrı sistemi", "restoran servis yönetimi"],
  },
];

export function getLandingPageBySlug(slug: string): LandingData | undefined {
  return LANDING_PAGES.find((item) => item.slug === slug);
}
