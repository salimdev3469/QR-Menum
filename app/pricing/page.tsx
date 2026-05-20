import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { SectionDivider } from "@/components/marketing/section-divider";
import { FAQ_ITEMS } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Fiyatlandırma | QR Menüm",
  description: "Starter, Growth ve Premium plan karşılaştırması.",
};

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <section>
        <PricingGrid />
      </section>

      <SectionDivider label="Sık Sorulanlar" />

      <section className="grid gap-3 md:grid-cols-2">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-base font-extrabold text-slate-900">{item.question}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </article>
        ))}
      </section>

      <SectionDivider label="Karar Ver" />

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">14 gün ücretsiz dene</h2>
        <p className="mt-2 text-sm text-slate-600">
          Kart bilgisi girmeden hesabını açıp tüm ana akışı test edebilirsin.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Hemen Başla
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100"
          >
            Satışa Danış
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
