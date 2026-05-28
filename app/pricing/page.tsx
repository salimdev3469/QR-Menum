import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { SectionDivider } from "@/components/marketing/section-divider";
import { FAQ_ITEMS } from "@/lib/marketing-content";
import { buildBreadcrumbJsonLd, buildJsonLd, buildPageMetadata, toAbsoluteUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Fiyatlandırma",
  description: "Starter, Growth ve Premium plan karşılaştırması.",
  path: "/pricing",
  keywords: ["qr menü fiyatları", "restoran yazılım fiyatlandırma", "dijital menü paketleri"],
});

const PRICING_PAGE_COPY = {
  faqLabel: "Sık Sorulanlar",
  decisionLabel: "Karar Ver",
  trialTitle: "14 gün ücretsiz dene",
  trialDescription: "Kart bilgisi girmeden hesabını açıp tüm ana akışı test edebilirsin.",
  startNow: "Hemen Başla",
  consultSales: "Satışa Danış",
} as const;

export default async function PricingPage() {
  const copy = PRICING_PAGE_COPY;
  const faqItems = FAQ_ITEMS;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Fiyatlandırma", path: "/pricing" },
  ]);

  const softwareJsonLd = buildJsonLd("SoftwareApplication", {
    name: "QR Menüm",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      url: toAbsoluteUrl("/pricing"),
      priceCurrency: "TRY",
      price: "790",
      availability: "https://schema.org/InStock",
    },
  });

  const faqJsonLd = buildJsonLd("FAQPage", {
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });

  return (
    <MarketingPageShell locale="tr">
      <JsonLd data={[breadcrumbJsonLd, softwareJsonLd, faqJsonLd]} />
      <section>
        <PricingGrid locale="tr" pricingCurrency="TRY" />
      </section>

      <SectionDivider label={copy.faqLabel} />

      <section className="grid gap-3 md:grid-cols-2">
        {faqItems.map((item) => (
          <article key={item.question} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-base font-extrabold text-slate-900">{item.question}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </article>
        ))}
      </section>

      <SectionDivider label={copy.decisionLabel} />

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{copy.trialTitle}</h2>
        <p className="mt-2 text-sm text-slate-600">{copy.trialDescription}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            {copy.startNow}
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            {copy.consultSales}
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
