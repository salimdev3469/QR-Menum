export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: "QR Menü" | "Restoran Yönetimi" | "Adisyon" | "Pazarlama";
  publishedAt: string;
  readingTimeMinutes: number;
  keywords: string[];
  ctaLabel: string;
  ctaHref: string;
  sections: BlogSection[];
}

export interface EditorialTopic {
  month: string;
  topics: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "qr-menu-fiyatlari-ve-maliyet-hesabi",
    title: "QR Menü Fiyatları ve Restoran İçin Gerçek Maliyet Hesabı",
    description:
      "QR menü sistemine geçerken lisans, stant, içerik ve operasyon kalemlerini hesaplayarak doğru bütçe planı çıkarın.",
    category: "QR Menü",
    publishedAt: "2026-05-10",
    readingTimeMinutes: 7,
    keywords: ["qr menü fiyatları", "qr menü maliyeti", "dijital menü bütçesi"],
    ctaLabel: "Fiyatlandırmayı Gör",
    ctaHref: "/pricing",
    sections: [
      {
        heading: "Toplam maliyet sadece paket ücreti değildir",
        paragraphs: [
          "Birçok işletme yalnızca yazılım paket fiyatını dikkate alır. Oysa gerçek toplam maliyet; stant üretimi, fotoğraf çekimi, ekip eğitimi ve güncelleme süresini de içerir.",
          "İlk 90 gün için toplam sahip olma maliyetini kalem bazında çıkarmak, yanlış paket seçiminden doğan ek harcamaları önler.",
        ],
      },
      {
        heading: "Lisans + operasyon birlikte planlanmalı",
        paragraphs: [
          "Aylık lisans maliyeti düşük olsa bile ekip güncelleme süresi yüksekse toplam maliyet büyür. Bu yüzden panel kullanım hızı ve içerik güncelleme akışı, fiyat kadar önemlidir.",
          "Stokta olmayan ürünlerin hızlı pasife alınması ve kampanya güncellemelerinin anlık yayınlanması operasyon maliyetini düşürür.",
        ],
      },
      {
        heading: "Doğru hedef: daha hızlı karar, daha yüksek masa dönüşü",
        paragraphs: [
          "QR menü yatırımının temel geri dönüşü yalnızca kağıt baskı tasarrufu değildir. Asıl etki, müşterinin sipariş kararını hızlandırması ve masa başına servis kapasitesini artırmasıdır.",
          "Bu nedenle fiyat karşılaştırması yaparken yalnızca maliyeti değil, masada geçirilen ortalama karar süresini de ölçün.",
        ],
      },
    ],
  },
  {
    slug: "restoran-adisyon-yazilimi-secerken-7-kriter",
    title: "Restoran Adisyon Yazılımı Seçerken 7 Kritik Kriter",
    description:
      "Adisyon yazılımı seçiminde hız, entegrasyon, raporlama ve servis akışı gibi kararınızı doğrudan etkileyen 7 kriteri öğrenin.",
    category: "Adisyon",
    publishedAt: "2026-05-18",
    readingTimeMinutes: 6,
    keywords: ["restoran adisyon yazılımı", "adisyon programı", "restoran yazılımı seçimi"],
    ctaLabel: "Özellikleri İncele",
    ctaHref: "/features",
    sections: [
      {
        heading: "1) Servis akışını hızlandırma etkisi",
        paragraphs: [
          "Yazılımın sipariş açma, güncelleme ve kapatma adımları ne kadar az tıklama gerektiriyorsa servis hızı o kadar artar.",
          "Özellikle yoğun saatlerde her saniye önemlidir; arayüz sadeliği verimlilik açısından kritik rol oynar.",
        ],
      },
      {
        heading: "2) Raporlama ve görünürlük",
        paragraphs: [
          "Kategori bazlı satış, saatlik yoğunluk ve kampanya performansı raporlanmıyorsa doğru karar almak zorlaşır.",
          "Yönetici panelinde günlük/haftalık görünüm sunan sistemler operasyon kararlarını hızlandırır.",
        ],
      },
      {
        heading: "3) QR menü entegrasyonu",
        paragraphs: [
          "Adisyon ve menü ayrı sistemlerde olduğunda içerik güncellemesi gecikir ve tutarsızlık artar.",
          "Menü yönetimi ile restoran operasyonunun tek panelde buluşması, ekip koordinasyonunu güçlendirir.",
        ],
      },
    ],
  },
  {
    slug: "masa-donusunu-artiran-dijital-menu-taktikleri",
    title: "Masa Dönüşünü Artıran 5 Dijital Menü Taktiği",
    description:
      "Dijital menü tasarımında doğru sıralama, etiket ve kampanya kullanımıyla sipariş karar süresini kısaltın.",
    category: "Pazarlama",
    publishedAt: "2026-04-25",
    readingTimeMinutes: 5,
    keywords: ["masa dönüşü artırma", "dijital menü optimizasyonu", "restoran satış artırma"],
    ctaLabel: "Ücretsiz Başla",
    ctaHref: "/register",
    sections: [
      {
        heading: "En çok satanları ilk ekranda konumlandırın",
        paragraphs: [
          "Müşterinin ilk 10 saniyede gördüğü ürünler sipariş kararını belirler. Yüksek marjlı ve popüler ürünleri üst sıraya taşıyın.",
        ],
      },
      {
        heading: "Etiketleri satış amacıyla kullanın",
        paragraphs: [
          "Yeni, Şef Özel veya Fırsat etiketleri görsel dikkat oluşturur. Etiket stratejisi, karar sürecini kısaltarak dönüşümü artırır.",
        ],
      },
      {
        heading: "Kampanyayı kategori bazlı yönetin",
        paragraphs: [
          "Tüm menüde indirim yerine seçili kategorilerde akıllı kampanya yönetimi, karlılığı koruyarak sipariş adedini artırır.",
        ],
      },
    ],
  },
  {
    slug: "restoran-yonetim-sistemi-ile-operasyon-kontrolu",
    title: "Restoran Yönetim Sistemi ile Operasyon Kontrolü Nasıl Kurulur?",
    description:
      "Restoran yönetim sisteminde menü, kampanya, masa ve çağrı akışını tek panelde yöneterek operasyonu standart hale getirin.",
    category: "Restoran Yönetimi",
    publishedAt: "2026-04-12",
    readingTimeMinutes: 8,
    keywords: ["restoran yönetim sistemi", "restoran operasyon yönetimi", "qr menü paneli"],
    ctaLabel: "Sistemi Satın Al",
    ctaHref: "/purchase",
    sections: [
      {
        heading: "Tek panel yaklaşımı neden kritik?",
        paragraphs: [
          "Farklı araçlara dağılmış süreçler veri kaybı ve iletişim hatası oluşturur. Tek panel yaklaşımı ekiplerin aynı veriye bakmasını sağlar.",
        ],
      },
      {
        heading: "Standart operasyon akışı tanımlayın",
        paragraphs: [
          "Ürün güncelleme sorumluluğu, kampanya onayı ve masa çağrı yanıt süresi için net süreç tanımı yapın.",
          "Sistem ne kadar iyi olursa olsun süreç tanımsızsa performans tutarsız kalır.",
        ],
      },
      {
        heading: "Kararları veriyle alın",
        paragraphs: [
          "Hangi kategori daha hızlı dönüşüyor, hangi kampanya daha çok sipariş getiriyor gibi soruları panel raporlarıyla izleyin.",
        ],
      },
    ],
  },
  {
    slug: "pos-kds-ve-qr-menu-entegrasyon-kontrol-listesi",
    title: "POS, KDS ve QR Menü Entegrasyonu İçin Kontrol Listesi",
    description:
      "POS ve mutfak ekranı süreçleriyle QR menüyü birlikte çalıştırmak için teknik ve operasyonel kontrol listesini uygulayın.",
    category: "Restoran Yönetimi",
    publishedAt: "2026-03-28",
    readingTimeMinutes: 7,
    keywords: ["pos entegrasyonu", "kds sistemi", "qr menü entegrasyon"],
    ctaLabel: "İletişime Geç",
    ctaHref: "/contact",
    sections: [
      {
        heading: "Veri akışını baştan tanımlayın",
        paragraphs: [
          "Ürün kodu, kategori eşleşmesi ve fiyat kaynağı tek bir doğruluk kaynağına bağlanmalıdır. Aksi halde sipariş tutarsızlıkları oluşur.",
        ],
      },
      {
        heading: "Gecikme ve hata senaryolarını test edin",
        paragraphs: [
          "Entegrasyon sadece normal durumda değil, yoğunluk ve bağlantı kesintisi senaryolarında da test edilmelidir.",
        ],
      },
      {
        heading: "Mutfak ve servis ekibini birlikte eğitin",
        paragraphs: [
          "Teknik entegrasyonun başarısı ekip alışkanlığıyla tamamlanır. POS-KDS-QR akışını tek eğitim planında ele alın.",
        ],
      },
    ],
  },
  {
    slug: "qr-menu-ile-sosyal-medya-etkilesimini-artirma",
    title: "QR Menü ile Sosyal Medya Etkileşimini Artırma Rehberi",
    description:
      "Public menü içinde sosyal medya linkleri, kampanya etiketleri ve görsel düzen ile dijital etkileşimi artırın.",
    category: "Pazarlama",
    publishedAt: "2026-03-14",
    readingTimeMinutes: 5,
    keywords: ["qr menü sosyal medya", "restoran dijital pazarlama", "menü etkileşimi"],
    ctaLabel: "Stand Siparişi Ver",
    ctaHref: "/stands",
    sections: [
      {
        heading: "Menü sayfasında görünür sosyal alan",
        paragraphs: [
          "Sosyal medya bağlantılarını footer yerine görünür bir alanda sunmak, geçiş oranlarını artırır.",
        ],
      },
      {
        heading: "Kampanya dili tutarlı olmalı",
        paragraphs: [
          "Instagram paylaşımı ile menüdeki kampanya başlığı aynı mesajı vermelidir. Tutarlılık, güveni ve dönüşümü artırır.",
        ],
      },
      {
        heading: "Görsel kaliteyi sabitleyin",
        paragraphs: [
          "Zayıf ürün fotoğrafları etkileşimi düşürür. Menüde kullanılan görsel kalite standardı marka algısını doğrudan etkiler.",
        ],
      },
    ],
  },
];

export const EDITORIAL_PIPELINE: EditorialTopic[] = [
  {
    month: "Haziran 2026",
    topics: [
      "QR menüde fiyat güncelleme otomasyonu",
      "Yaz sezonu kampanyalarında kategori stratejisi",
    ],
  },
  {
    month: "Temmuz 2026",
    topics: [
      "Restoranlarda müşteri yorum yönetimi",
      "Garson çağrı sistemi ile servis süresi azaltma",
    ],
  },
  {
    month: "Ağustos 2026",
    topics: [
      "Kafe menüsünde upsell ürün konumlandırma",
      "Adisyon hatalarını azaltan operasyon şablonu",
    ],
  },
  {
    month: "Eylül 2026",
    topics: [
      "Sonbahar menüsü geçiş planı",
      "Dijital menüde çok dilli içerik yönetimi",
    ],
  },
  {
    month: "Ekim 2026",
    topics: [
      "POS migrasyonunda veri temizlik rehberi",
      "Kampanya performansı için KPI seti",
    ],
  },
  {
    month: "Kasım 2026",
    topics: [
      "Kış sezonu için marj koruyan fiyatlandırma",
      "Yoğun dönemde masa dönüşü optimizasyonu",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
