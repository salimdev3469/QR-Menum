import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { SectionDivider } from "@/components/marketing/section-divider";
import { FAQ_ITEMS, FAQ_ITEMS_EN } from "@/lib/marketing-content";
import { resolveRequestLocaleContext } from "@/lib/request-locale";

export const metadata: Metadata = {
  title: "Fiyatlandırma | QR Menüm",
  description: "Starter, Growth ve Premium plan karşılaştırması.",
};

const PRICING_PAGE_COPY = {
  tr: {
    faqLabel: "Sık Sorulanlar",
    decisionLabel: "Karar Ver",
    trialTitle: "14 gün ücretsiz dene",
    trialDescription: "Kart bilgisi girmeden hesabını açıp tüm ana akışı test edebilirsin.",
    startNow: "Hemen Başla",
    consultSales: "Satışa Danış",
  },
  en: {
    faqLabel: "Frequently Asked Questions",
    decisionLabel: "Decide",
    trialTitle: "Try 14 days free",
    trialDescription: "Create your account without card details and test the full core flow.",
    startNow: "Start Now",
    consultSales: "Talk to Sales",
  },
} as const;

export default async function PricingPage() {
  const requestContext = await resolveRequestLocaleContext();
  const { locale, pricingCurrency } = requestContext;
  const copy = PRICING_PAGE_COPY[locale];
  const faqItems = locale === "tr" ? FAQ_ITEMS : FAQ_ITEMS_EN;

  return (
    <MarketingPageShell locale={locale}>
      <section>
        <PricingGrid locale={locale} pricingCurrency={pricingCurrency} />
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
