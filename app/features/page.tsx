import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";
import { FEATURE_BLOCKS } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Özellikler | QR Menüm",
  description: "QR Menüm ürün modülleri: varyasyon, alerjen, etiket, kampanya ve sosyal medya.",
};

export default function FeaturesPage() {
  return (
    <MarketingPageShell>
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Özellikler</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Menüyü sadece dijitalleştirme, satışa dönüştür.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          QR Menüm; ürün sunumu, kampanya yönetimi ve müşteri etkileşimini tek panelde toplar.
          Aşağıdaki modüller doğrudan dashboard’dan yönetilir.
        </p>
      </section>

      <SectionDivider label="Modüller" />

      <section className="grid gap-4 md:grid-cols-2">
        {FEATURE_BLOCKS.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <SectionDivider label="Başlangıç" />

      <section className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-extrabold tracking-tight">Canlıya çıkmak için hazır mısın?</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Hesabını aç, işletme bilgilerini doldur, menünü oluştur ve QR kodunu indir.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400"
          >
            Ücretsiz Başla
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-slate-500 px-5 py-2.5 text-sm font-bold text-slate-100 hover:bg-slate-800"
          >
            Paketleri Gör
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
