import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";

export const metadata: Metadata = {
  title: "Hakkımızda | QR Menüm",
  description: "QR Menüm vizyonu, yaklaşımı ve ürün prensipleri.",
};

const principles = [
  {
    title: "Sade Yönetim",
    text: "Teknik olmayan işletme sahiplerinin dahi 10 dakika içinde menü yayınlayabileceği bir panel tasarlarız.",
  },
  {
    title: "Hızlı Mobil Deneyim",
    text: "Public menü tarafında önceliğimiz hızlı açılış, net ürün kartları ve kesintisiz mobil akıştır.",
  },
  {
    title: "Satış Odaklı Modüller",
    text: "Varyasyon, etiket, alerjen ve kampanya gibi özellikleri direkt gelir etkisi üreten kullanıma göre geliştiririz.",
  },
];

export default function AboutPage() {
  return (
    <MarketingPageShell>
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Hakkımızda</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Restoranların dijital menü geçişini karmaşık değil, ölçülebilir hale getiriyoruz.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          QR Menüm; restoran ve kafelerin menü operasyonunu daha hızlı yönetebilmesi, müşterinin
          karar süresini kısaltması ve masa dönüşünü artırması için geliştirildi.
        </p>
      </section>

      <SectionDivider label="Prensiplerimiz" />

      <section className="grid gap-4 md:grid-cols-3">
        {principles.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </article>
        ))}
      </section>

      <SectionDivider label="İletişim" />

      <section className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-extrabold tracking-tight">Ekibimizle konuş</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Satış, teknik entegrasyon veya operasyonel sorular için doğrudan destek ekibine ulaşabilirsin.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-400"
          >
            İletişime Geç
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
