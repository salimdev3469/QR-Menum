import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";

export const metadata: Metadata = {
  title: "Çerez Politikası | QR Menüm",
  description: "QR Menüm çerez kullanımına ilişkin detaylı bilgilendirme metni.",
};

const COOKIE_SECTIONS = [
  {
    title: "1) Çerez Nedir?",
    items: [
      "Çerezler, ziyaret ettiğiniz internet sitesinin tarayıcınıza kaydettiği küçük metin dosyalarıdır.",
      "Bu dosyalar sayesinde tercihlerinizi hatırlayabilir ve hizmeti daha güvenli şekilde sunabiliriz.",
    ],
  },
  {
    title: "2) Hangi Çerezleri Kullanıyoruz?",
    items: [
      "Zorunlu çerezler: Oturum güvenliği, kimlik doğrulama ve temel panel işlevleri için kullanılır.",
      "Analitik çerezler: Site performansını ve kullanım yoğunluğunu ölçmek için, yalnızca izin vermeniz halinde kullanılır.",
    ],
  },
  {
    title: "3) Çerezlerin Kullanım Amaçları",
    items: [
      "Güvenli giriş ve oturum sürekliliği sağlamak.",
      "Tercihlerinizi hatırlamak ve kullanıcı deneyimini iyileştirmek.",
      "Analitik izin verdiğinizde ürün geliştirme ve performans optimizasyonu yapmak.",
    ],
  },
  {
    title: "4) Çerez Tercihleri Nasıl Yönetilir?",
    items: [
      "İlk ziyaretinizde çıkan çerez panelinden analitik çerezleri kabul edebilir veya reddedebilirsiniz.",
      "Tercihlerinizi daha sonra tarayıcı ayarlarından veya tekrar gösterilen panel üzerinden güncelleyebilirsiniz.",
      "Tarayıcı üzerinden tüm çerezleri engellemeniz bazı işlevlerin çalışmasını sınırlayabilir.",
    ],
  },
  {
    title: "5) Üçüncü Taraf Hizmetler",
    items: [
      "Analitik ve altyapı hizmeti aldığımız üçüncü taraf sağlayıcılar, kendi teknik çerezlerini kullanabilir.",
      "Bu çerezler yalnızca ilgili hizmetin çalışması veya izin verilen analiz amaçları için değerlendirilir.",
    ],
  },
] as const;

export default function CookiesPage() {
  return (
    <MarketingPageShell>
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Yasal</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">Çerez Politikası</h1>
        <p className="mt-3 text-sm text-slate-600">Son güncelleme: 21 Mayıs 2026</p>
      </section>

      <SectionDivider label="Çerezler" />

      <section className="grid gap-4">
        {COOKIE_SECTIONS.map((section) => (
          <article key={section.title} className="rounded-2xl border border-slate-200 bg-white/90 p-6">
            <h2 className="text-base font-extrabold text-slate-900 md:text-lg">{section.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-6 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-extrabold text-slate-900 md:text-lg">6) İletişim</h2>
        <p className="mt-3">
          Çerez kullanımı ve tercihlerinize ilişkin sorularınız için bizimle iletişime geçebilirsiniz:
          <br />
          E-posta: <span className="font-semibold">salimaka2014@gmail.com</span>
          <br />
          Telefon: <span className="font-semibold">0553 351 7769</span>
        </p>
      </section>
    </MarketingPageShell>
  );
}
