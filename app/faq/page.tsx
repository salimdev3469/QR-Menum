import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionDivider } from "@/components/marketing/section-divider";
import { FAQ_ITEMS } from "@/lib/marketing-content";
import { buildBreadcrumbJsonLd, buildJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sık Sorulan Sorular",
  description: "QR Menüm sık sorulan sorular sayfası.",
  path: "/faq",
  keywords: ["qr menü sss", "restoran yazılımı soruları", "dijital menü destek"],
});

const extraQuestions = [
  {
    question: "Fotoğraf yükleme sınırı nedir?",
    answer: "Ürün başına 3 görsel, galeri için toplam 10 görsel yüklenebilir.",
  },
  {
    question: "Slug otomatik güncelleniyor mu?",
    answer: "Evet, işletme adı değişirse slug otomatik güncellenir ve çakışma varsa ek numara verilir.",
  },
  {
    question: "QR kod indirilebilir mi?",
    answer: "Evet, dashboard üzerinden PNG formatında indirebilirsiniz.",
  },
  {
    question: "Public menü için giriş gerekiyor mu?",
    answer: "Hayır. `/menu/[slug]` herkese açık çalışır; yalnız aktif restoranlar gösterilir.",
  },
];

export default function FaqPage() {
  const faqJsonLd = buildJsonLd("FAQPage", {
    mainEntity: [...FAQ_ITEMS, ...extraQuestions].map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Sık Sorulan Sorular", path: "/faq" },
  ]);

  return (
    <MarketingPageShell locale="tr">
      <JsonLd data={[faqJsonLd, breadcrumbJsonLd]} />
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Sık Sorulan Sorular</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          En çok sorulan konuları tek sayfada topladık.
        </h1>
      </section>

      <SectionDivider label="Genel" />

      <section className="grid gap-3 md:grid-cols-2">
        {[...FAQ_ITEMS, ...extraQuestions].map((item) => (
          <article key={item.question} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-base font-extrabold text-slate-900">{item.question}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
          </article>
        ))}
      </section>

      <SectionDivider label="Destek" />

      <section className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-extrabold tracking-tight">Başka bir sorunuz mu var?</h2>
        <p className="mt-2 text-sm text-slate-200">
          Destek ekibimiz en kısa sürede size dönüş yapar.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400"
          >
            Destekle İletişime Geç
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-slate-500 px-5 py-2.5 text-sm font-bold text-slate-100 hover:bg-slate-800"
          >
            Hesap Aç
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
