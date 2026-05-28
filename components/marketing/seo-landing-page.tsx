import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionDivider } from "@/components/marketing/section-divider";
import type { LandingData } from "@/lib/seo-landings";
import { buildBreadcrumbJsonLd, buildJsonLd, toAbsoluteUrl } from "@/lib/seo";

interface SeoLandingPageProps {
  data: LandingData;
}

export function SeoLandingPage({ data }: SeoLandingPageProps) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: data.label, path: `/${data.slug}` },
  ]);

  const faqJsonLd = buildJsonLd("FAQPage", {
    mainEntity: data.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });

  const webPageJsonLd = buildJsonLd("WebPage", {
    name: data.title,
    description: data.description,
    url: toAbsoluteUrl(`/${data.slug}`),
  });

  return (
    <MarketingPageShell locale="tr">
      <JsonLd data={[breadcrumbJsonLd, faqJsonLd, webPageJsonLd]} />

      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{data.label}</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{data.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={data.primaryCtaHref}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            {data.primaryCtaLabel}
          </Link>
          <Link
            href={data.secondaryCtaHref}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:bg-slate-100"
          >
            {data.secondaryCtaLabel}
          </Link>
        </div>
      </section>

      <SectionDivider label="Sorun" />
      <section className="rounded-2xl border border-slate-200 bg-white/90 p-5">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 md:text-base">
          {data.problemItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <SectionDivider label="Çözüm" />
      <section className="rounded-2xl border border-slate-200 bg-white/90 p-5">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 md:text-base">
          {data.solutionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <SectionDivider label="Özellikler" />
      <section className="grid gap-3 md:grid-cols-2">
        {data.featureItems.map((item) => (
          <article key={item} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{item}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Bu başlık, operasyonel verimlilik ve müşteri deneyimi için doğrudan uygulanabilir bir akış sağlar.
            </p>
          </article>
        ))}
      </section>

      <SectionDivider label="Karşılaştırma" />
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90">
        <h2 className="border-b border-slate-200 px-5 py-4 text-lg font-extrabold tracking-tight text-slate-900">
          {data.comparisonTitle}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Kriter</th>
                <th className="px-4 py-3 font-semibold">Geleneksel Akış</th>
                <th className="px-4 py-3 font-semibold">QR Menüm</th>
              </tr>
            </thead>
            <tbody>
              {data.comparisonRows.map((row) => (
                <tr key={row.metric} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.metric}</td>
                  <td className="px-4 py-3">{row.legacy}</td>
                  <td className="px-4 py-3">{row.qrmenum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SectionDivider label="SSS" />
      <section className="grid gap-3 md:grid-cols-2">
        {data.faq.map((item) => (
          <article key={item.question} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-base font-extrabold text-slate-900">{item.question}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-extrabold tracking-tight">Hızlı başlangıç için bir sonraki adım</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Bu çözümü kendi işletmene uygulamak için hesap açabilir veya satış ekibinden uygun paket önerisi alabilirsin.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={data.primaryCtaHref}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400"
          >
            {data.primaryCtaLabel}
          </Link>
          <Link
            href={data.secondaryCtaHref}
            className="rounded-xl border border-slate-500 px-5 py-2.5 text-sm font-bold text-slate-100 hover:bg-slate-800"
          >
            {data.secondaryCtaLabel}
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
