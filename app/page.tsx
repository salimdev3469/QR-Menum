import type { Metadata } from "next";
import Image from "next/image";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { SessionAwarePrimaryCta } from "@/components/marketing/session-aware-primary-cta";
import { StandShowcaseSection } from "@/components/marketing/stand-showcase-section";
import { LoadingLink } from "@/components/ui/loading-link";
import { SectionDivider } from "@/components/marketing/section-divider";
import { formatMarketPriceFromTry } from "@/lib/market-pricing";
import { FAQ_ITEMS, FEATURE_BLOCKS } from "@/lib/marketing-content";
import { buildJsonLd, buildPageMetadata, toAbsoluteUrl } from "@/lib/seo";
import { getStandProductCards } from "@/lib/stand-products";
import { STAND_UNIT_PRICE } from "@/lib/stand-pricing";
import { generateQrDataUrl } from "@/services/qr-service";

type HomeLocale = "tr" | "en";

interface QuickLink {
  href: string;
  title: string;
  text: string;
}

interface StatItem {
  label: string;
  value: string;
  hint: string;
  showFlags?: boolean;
}

interface LanguageFlag {
  id: string;
  src: string;
  alt: string;
}

export const metadata: Metadata = buildPageMetadata({
  title: "QR Menü ve Restoran Yönetim Sistemi",
  description:
    "QR Menüm ile dijital menü yönetimi, kampanya kurgusu ve restoran operasyon akışını tek panelden yönetin.",
  path: "/",
  keywords: [
    "qr menü",
    "restoran yönetim sistemi",
    "dijital menü",
    "restoran adisyon yazılımı",
    "garson çağrı sistemi",
  ],
});

function buildHomepagePreviewMenuConfig(): { targetUrl: string; displayUrl: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const sampleSlug = "test-menu";
  const fallbackHost = "qrmenum.app";

  if (!appUrl) {
    const targetUrl = `https://${fallbackHost}/menu/${sampleSlug}`;
    return {
      targetUrl,
      displayUrl: targetUrl.replace(/^https?:\/\//, ""),
    };
  }

  const normalizedAppUrl = appUrl.replace(/\/$/, "");
  const targetUrl = `${normalizedAppUrl}/menu/${sampleSlug}`;

  return {
    targetUrl,
    displayUrl: targetUrl.replace(/^https?:\/\//, ""),
  };
}

const LANGUAGE_FLAGS: LanguageFlag[] = [
  { id: "tr", src: "/flags/tr.png", alt: "Türkiye bayrağı" },
  { id: "ru", src: "/flags/ru.png", alt: "Rusya bayrağı" },
  { id: "us", src: "/flags/us.png", alt: "United States flag" },
  { id: "sa", src: "/flags/sa.svg", alt: "Saudi Arabia flag" },
];

const SLOGAN_ITEMS: Record<HomeLocale, string[]> = {
  tr: [
    "Müşteri QR'ı okutur, menüye anında girer.",
    "Fotoğraflı ürün kartlarıyla karar süresi kısalır.",
    "Daha hızlı seçim, daha yüksek masa dönüşü.",
  ],
  en: [
    "Guests scan the QR and enter the menu instantly.",
    "Photo-rich product cards shorten decision time.",
    "Faster choices, higher table turnover.",
  ],
};

const QUICK_LINKS: Record<HomeLocale, QuickLink[]> = {
  tr: [
    { href: "/features", title: "Özellikler", text: "Tüm modülleri detaylı inceleyin." },
    { href: "/pricing", title: "Paketler", text: "İşletmenize uygun planı seçin." },
    { href: "/purchase", title: "Sistem Satın Al", text: "Satış ekibine plan talebi bırakın." },
    { href: "/stands", title: "QR Stant Siparişi", text: "Masa sayısına göre stant siparişi verin." },
    { href: "/blog", title: "Blog", text: "QR menü ve restoran yönetimi rehberlerini okuyun." },
    { href: "/qr-menu-sistemi", title: "QR Menü Sistemi", text: "İşletmenize uygun çözüm yapısını inceleyin." },
    { href: "/about", title: "Hakkımızda", text: "Platform yaklaşımımızı öğrenin." },
    { href: "/contact", title: "İletişim", text: "Satış ve destek ekibine ulaşın." },
  ],
  en: [
    { href: "/features", title: "Features", text: "Explore all modules in detail." },
    { href: "/pricing", title: "Plans", text: "Choose the right plan for your business." },
    { href: "/purchase", title: "Buy the System", text: "Submit your plan request to sales." },
    { href: "/stands", title: "Order QR Stands", text: "Order stands based on your table count." },
    { href: "/about", title: "About", text: "Learn our product approach." },
    { href: "/contact", title: "Contact", text: "Reach sales and support." },
  ],
};

const STATS: Record<HomeLocale, StatItem[]> = {
  tr: [
    {
      label: "Kurulum",
      value: "5 dk",
      hint: "İlk menünüzü dakikalar içinde yayına alın, QR kodunuzu indirip masalara hemen yerleştirin.",
    },
    { label: "Dil Desteği", value: "4 Dil", hint: "Türkçe, Rusça, İngilizce ve Arapça hazır.", showFlags: true },
    {
      label: "Yayın",
      value: "Anında",
      hint: "Fiyat ve içerik değişiklikleri menüye beklemeden yansır, müşteriler her zaman güncel listeyi görür.",
    },
  ],
  en: [
    {
      label: "Setup",
      value: "5 min",
      hint: "Publish your first menu within minutes, then download your QR code and place it on tables right away.",
    },
    { label: "Language Support", value: "4 Languages", hint: "Turkish, Russian, English, and Arabic ready.", showFlags: true },
    {
      label: "Publishing",
      value: "Instant",
      hint: "Price and content updates appear on the menu immediately, so guests always see the latest version.",
    },
  ],
};

const STAND_FEATURE_PILLS: Record<HomeLocale, string[]> = {
  tr: ["Hazır Tasarım Seçimi", "Kendi Tasarımını Yükle", "Panelde Anlık Takip"],
  en: ["Preset Design Options", "Upload Your Own Design", "Real-time Panel Tracking"],
};

const FEATURE_BLOCKS_EN = [
  {
    title: "Product Variations",
    description:
      "Define size, weight, or portion options under a single product and reflect pricing automatically.",
  },
  {
    title: "Allergen Warnings",
    description:
      "Display allergen details clearly on each product card and provide a safer choice experience.",
  },
  {
    title: "Product Labels",
    description: "Highlight key items with tags like Chef's Special, New, or Deal.",
  },
];

const FAQ_ITEMS_EN = [
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

const HOME_COPY = {
  tr: {
    heroTitleFirstLine: "Menünü dijitalleştir,",
    heroTitleSecondLine: "masaya anında satış akışı kur.",
    heroDescription:
      "Restoran ve kafeler için sade ama güçlü panel. Kategorileri yönet, ürün fotoğraflarını yükle, public menünü yayınla ve QR kodunu anında indir.",
    primaryCta: "Hemen Kayıt Ol",
    secondaryCta: "Paketleri Gör",
    previewTitle: "Canlı QR Önizleme",
    previewBadge: "Aktif",
    qrImageAlt: "QR kod önizleme",
    previewScanPrompt: "Hemen okut, menü nasıl görünecek gör.",
    previewDirectCta: "Test Menüsünü Görüntüle",
    previewFootnote: "Bu test QR, örnek public menü görünümünü açar.",
    featuredSectionLabel: "Öne Çıkanlar",
    liveSectionLabel: "Canlı Deneyim",
    liveTitle: "QR okut, menünü aç, sipariş kararını hızlandır.",
    liveDescription:
      "Restoran içinde en kritik an, müşterinin menüye baktığı an. Bu deneyimi hızlı ve ikna edici hale getirip satışa çevir.",
    livePrimaryCta: "Menümü Hemen Yayınla",
    liveSecondaryCta: "Özellikleri İncele",
    liveImageAlt: "Müşteri QR menüyü telefonundan inceliyor",
    pricingSectionLabel: "Paketler",
    standSectionLabel: "QR Stant",
    standTitle: "Masalar için hazır QR stantlarını tek adımda sipariş verin.",
    standDescription:
      "Masa sayınızı girin, hazır tasarım seçin veya kendi tasarımınızı yükleyin. Stant başı {{price}} fiyatla siparişler doğrudan operasyon panelimize düşer.",
    standPrimaryCta: "Stant Siparişi Ver",
    standSecondaryCta: "Sistem Satın Al",
    standImageAlt: "QR menü stand örneği",
    exploreSectionLabel: "Keşfet",
    faqSectionLabel: "SSS",
  },
  en: {
    heroTitleFirstLine: "Digitize your menu,",
    heroTitleSecondLine: "launch table-side sales instantly.",
    heroDescription:
      "A simple yet powerful panel for restaurants and cafes. Manage categories, upload product photos, publish your public menu, and download your QR code instantly.",
    primaryCta: "Register Now",
    secondaryCta: "View Plans",
    previewTitle: "Live QR Preview",
    previewBadge: "Active",
    qrImageAlt: "QR code preview",
    previewScanPrompt: "Scan now and see how your public menu will look.",
    previewDirectCta: "View Test Menu",
    previewFootnote: "This test QR opens a sample public menu view.",
    featuredSectionLabel: "Highlights",
    liveSectionLabel: "Live Experience",
    liveTitle: "Scan QR, open menu, speed up order decisions.",
    liveDescription:
      "The most critical in-restaurant moment is when guests read the menu. Make that moment fast and persuasive to drive more sales.",
    livePrimaryCta: "Publish My Menu",
    liveSecondaryCta: "Explore Features",
    liveImageAlt: "Customer browsing the QR menu on a phone",
    pricingSectionLabel: "Plans",
    standSectionLabel: "QR Stand",
    standTitle: "Order ready-to-use table QR stands in one step.",
    standDescription:
      "Enter your table count, pick a preset design, or upload your own artwork. At {{price}} per stand, orders drop directly into our operations panel.",
    standPrimaryCta: "Order QR Stands",
    standSecondaryCta: "Buy the System",
    standImageAlt: "QR menu stand sample",
    exploreSectionLabel: "Explore",
    faqSectionLabel: "FAQ",
  },
} as const;

export default async function HomePage() {
  const locale: HomeLocale = "tr";
  const pricingCurrency = "TRY";
  const copy = HOME_COPY[locale];
  const sloganItems = SLOGAN_ITEMS[locale];
  const quickLinks = QUICK_LINKS[locale];
  const stats = STATS[locale];
  const standFeaturePills = STAND_FEATURE_PILLS[locale];
  const featureBlocks = locale === "tr" ? FEATURE_BLOCKS.slice(0, 3) : FEATURE_BLOCKS_EN;
  const faqItems = locale === "tr" ? FAQ_ITEMS.slice(0, 4) : FAQ_ITEMS_EN;
  const ctaLoadingText = locale === "tr" ? "Yonlendiriliyor..." : "Redirecting...";
  const previewMenu = buildHomepagePreviewMenuConfig();
  const standUnitPrice = formatMarketPriceFromTry(STAND_UNIT_PRICE, pricingCurrency);
  const standProductCards = getStandProductCards(locale, standUnitPrice);
  const standDescription = copy.standDescription.replace("{{price}}", standUnitPrice);
  const previewQrDataUrl = await generateQrDataUrl(previewMenu.targetUrl).catch(() => "");

  const organizationJsonLd = buildJsonLd("Organization", {
    name: "QR Menüm",
    url: toAbsoluteUrl("/"),
    logo: toAbsoluteUrl("/apple-icon.png"),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "salimaka2014@gmail.com",
      telephone: "+90-553-351-7769",
      areaServed: "TR",
    },
  });

  const websiteJsonLd = buildJsonLd("WebSite", {
    name: "QR Menüm",
    url: toAbsoluteUrl("/"),
    inLanguage: "tr-TR",
  });

  const softwareJsonLd = buildJsonLd("SoftwareApplication", {
    name: "QR Menüm",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "790",
      priceCurrency: "TRY",
      url: toAbsoluteUrl("/pricing"),
      availability: "https://schema.org/InStock",
    },
  });

  return (
    <div className="relative overflow-hidden" lang={locale}>
      <JsonLd data={[organizationJsonLd, websiteJsonLd, softwareJsonLd]} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(16,185,129,0.18),transparent_34%),radial-gradient(circle_at_88%_16%,rgba(14,165,233,0.16),transparent_38%),radial-gradient(circle_at_50%_84%,rgba(249,115,22,0.12),transparent_36%)]" />

      <MarketingHeader locale={locale} />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-10 md:pt-14">
        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.04] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              {copy.heroTitleFirstLine}
              <span className="block bg-gradient-to-r from-emerald-600 via-cyan-600 to-sky-600 bg-clip-text text-transparent">
                {copy.heroTitleSecondLine}
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">{copy.heroDescription}</p>

            <div className="flex flex-wrap gap-3">
              <SessionAwarePrimaryCta
                locale={locale}
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_26px_rgba(5,150,105,0.28)] transition hover:translate-y-[-1px] hover:bg-emerald-700"
                loadingText={ctaLoadingText}
              />
              <LoadingLink
                href="/pricing"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                loadingText={ctaLoadingText}
              >
                {copy.secondaryCta}
              </LoadingLink>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 sm:items-stretch">
              {stats.map((item) => {
                const isEnglishLanguageStat = Boolean(item.showFlags);
                const valueClassName = isEnglishLanguageStat
                  ? "mt-0.5 max-w-full font-extrabold tracking-tight text-slate-900"
                  : "mt-0.5 max-w-full text-[2rem] font-extrabold leading-tight tracking-tight text-slate-900 text-balance sm:text-[2.1rem] lg:text-[2.2rem]";
                const valueStyle = isEnglishLanguageStat
                  ? ({
                      fontSize: "clamp(1.35rem, 2.2vw, 1.8rem)",
                      lineHeight: 1.08,
                      overflowWrap: "anywhere",
                    } as const)
                  : undefined;

                return (
                  <div
                    key={item.label}
                    className="flex h-full min-w-0 flex-col justify-between rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p>
                      <p className={valueClassName} style={valueStyle}>
                        {item.value}
                      </p>
                    </div>
                    <div className="mt-3 min-w-0 space-y-1.5">
                      {item.showFlags ? (
                        <div className="flex flex-wrap items-center gap-2">
                          {LANGUAGE_FLAGS.map((flag) => (
                            <span
                              key={flag.id}
                              className="overflow-hidden rounded-sm border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                            >
                              <Image
                                src={flag.src}
                                alt={flag.alt}
                                width={30}
                                height={20}
                                sizes="30px"
                                className="h-[20px] w-[30px] object-cover"
                                priority={false}
                              />
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <p className="text-xs leading-snug text-slate-500">{item.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="qr-float absolute -left-4 -top-4 h-20 w-20 rounded-2xl bg-emerald-200/70 blur-2xl" />
            <div className="qr-float-delayed absolute -bottom-6 right-4 h-24 w-24 rounded-full bg-cyan-200/70 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{copy.previewTitle}</p>
                  <p className="text-sm font-bold text-slate-900">{previewMenu.displayUrl}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {copy.previewBadge}
                </span>
              </div>

              <div className="relative mx-auto w-full max-w-[310px] rounded-3xl border border-slate-200 bg-slate-950 p-5">
                <div className="relative overflow-hidden rounded-2xl bg-white p-4">
                  <p className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-center text-[11px] font-semibold leading-tight text-emerald-700">
                    {copy.previewScanPrompt}
                  </p>
                  <div className="pointer-events-none absolute left-4 right-4 top-[20%] z-10 h-[2px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent qr-scan-line" />
                  <a href={previewMenu.targetUrl} target="_blank" rel="noreferrer" className="block">
                    {previewQrDataUrl ? (
                      <Image
                        src={previewQrDataUrl}
                        alt={copy.qrImageAlt}
                        width={1272}
                        height={1278}
                        sizes="(max-width: 768px) 75vw, 320px"
                        className="h-auto w-full"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/qr_empty.png"
                        alt={copy.qrImageAlt}
                        width={1272}
                        height={1278}
                        sizes="(max-width: 768px) 75vw, 320px"
                        className="h-auto w-full"
                        priority={false}
                      />
                    )}
                  </a>
                </div>

                <LoadingLink
                  href="/menu/test-menu"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-400"
                  loadingText={ctaLoadingText}
                >
                  {copy.previewDirectCta}
                </LoadingLink>

                <div className="mt-4 rounded-xl bg-slate-900/65 px-3 py-2 text-xs text-slate-200">
                  {copy.previewFootnote}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider label={copy.featuredSectionLabel} />

        <section className="grid gap-4 md:grid-cols-3">
          {featureBlocks.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur"
            >
              <h2 className="text-base font-extrabold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>

        <SectionDivider label={copy.liveSectionLabel} />

        <section>
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 p-5 text-slate-900 shadow-sm backdrop-blur-sm md:p-8">
            <div className="relative grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <h2 className="max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl">
                  {copy.liveTitle}
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">{copy.liveDescription}</p>

                <ul className="mt-6 space-y-2.5 text-lg text-slate-700 md:text-xl">
                  {sloganItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-[11px] h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <LoadingLink
                    href="/register"
                    className="rounded-xl bg-emerald-500 px-5 py-2.5 text-base font-bold text-white transition hover:bg-emerald-400"
                    loadingText={ctaLoadingText}
                  >
                    {copy.livePrimaryCta}
                  </LoadingLink>
                  <LoadingLink
                    href="/features"
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-base font-bold text-slate-900 transition hover:bg-slate-100"
                    loadingText={ctaLoadingText}
                  >
                    {copy.liveSecondaryCta}
                  </LoadingLink>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm pb-4 pr-3 lg:max-w-md lg:pb-6 lg:pr-6">
                <div className="absolute inset-x-8 bottom-2 h-16 rounded-full bg-slate-400/35 blur-2xl" />
                <Image
                  src="/customer-qr-showcase.jpg"
                  alt={copy.liveImageAlt}
                  width={447}
                  height={558}
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="relative ml-auto h-auto w-[92%] object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.38)]"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <SectionDivider label={copy.pricingSectionLabel} />
        <section>
          <PricingGrid locale={locale} pricingCurrency={pricingCurrency} />
        </section>

        <SectionDivider label={copy.standSectionLabel} />
        <StandShowcaseSection
          sectionLabel={copy.standSectionLabel}
          title={copy.standTitle}
          description={standDescription}
          primaryCta={copy.standPrimaryCta}
          secondaryCta={copy.standSecondaryCta}
          ctaLoadingText={ctaLoadingText}
          featurePills={standFeaturePills}
          productCards={standProductCards}
        />

        <SectionDivider label={copy.exploreSectionLabel} />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <LoadingLink
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              loadingText={ctaLoadingText}
            >
              <p className="text-lg font-extrabold tracking-tight text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </LoadingLink>
          ))}
        </section>

        <SectionDivider label={copy.faqSectionLabel} />
        <section className="grid gap-3 md:grid-cols-2">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
              <h3 className="text-base font-bold text-slate-900">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </article>
          ))}
        </section>
      </main>

      <MarketingFooter locale={locale} />
    </div>
  );
}
