import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";
import { CONTACT_CHANNELS } from "@/lib/marketing-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "İletişim",
  description: "Satış ve destek ekibi iletişim sayfası.",
  path: "/contact",
  keywords: ["qr menü iletişim", "restoran yazılımı satış", "qr menüm destek"],
});

const quickActions = [
  { title: "Yeni Müşteri", text: "Paket seçimi ve demo akışı için bizimle görüş.", href: "/pricing" },
  { title: "Teknik Destek", text: "Mevcut müşteriler için onboarding ve destek.", href: "/login" },
  { title: "İş Ortaklığı", text: "Ajans ve çözüm ortağı teklifleri için iletişime geç.", href: "mailto:salimaka2014@gmail.com" },
];

export default function ContactPage() {
  return (
    <MarketingPageShell locale="tr">
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">İletişim</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Satış ve destek ekibine doğrudan ulaşın.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          İhtiyacınıza uygun plan önerisi, ürün kurulumu veya teknik sorular için aşağıdaki kanallardan bize yazabilirsiniz.
        </p>
      </section>

      <SectionDivider label="Kanallar" />

      <section className="grid gap-4 md:grid-cols-3">
        {CONTACT_CHANNELS.map((channel) => (
          <article key={channel.label} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{channel.label}</p>
            <p className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{channel.value}</p>
          </article>
        ))}
      </section>

      <SectionDivider label="Hızlı İşlem" />

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            <Link
              href={item.href}
              className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
            >
              Devam Et
            </Link>
          </article>
        ))}
      </section>
    </MarketingPageShell>
  );
}
