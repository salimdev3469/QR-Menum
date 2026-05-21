import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";
import { resolveRequestLocale } from "@/lib/request-locale";

export const metadata: Metadata = {
  title: "Çerez Politikası | QR Menüm",
  description: "QR Menüm çerez kullanımına ilişkin detaylı bilgilendirme metni.",
};

const COOKIE_CONTENT = {
  tr: {
    legalLabel: "Yasal",
    title: "Çerez Politikası",
    updatedAt: "Son güncelleme: 21 Mayıs 2026",
    sectionLabel: "Çerezler",
    sections: [
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
    ],
    finalTitle: "6) İletişim",
    finalParagraph:
      "Çerez kullanımı ve tercihlerinize ilişkin sorularınız için bizimle iletişime geçebilirsiniz:\nE-posta: salimaka2014@gmail.com\nTelefon: 0553 351 7769",
  },
  en: {
    legalLabel: "Legal",
    title: "Cookie Policy",
    updatedAt: "Last updated: May 21, 2026",
    sectionLabel: "Cookies",
    sections: [
      {
        title: "1) What Is a Cookie?",
        items: [
          "Cookies are small text files saved by the website you visit in your browser.",
          "These files help us remember your preferences and provide the service more securely.",
        ],
      },
      {
        title: "2) Which Cookies Do We Use?",
        items: [
          "Mandatory cookies: used for session security, authentication, and core panel functions.",
          "Analytics cookies: used to measure site performance and usage intensity, only if you grant consent.",
        ],
      },
      {
        title: "3) Purposes of Cookie Use",
        items: [
          "To provide secure login and session continuity.",
          "To remember your preferences and improve user experience.",
          "When analytics consent is given, to support product development and performance optimization.",
        ],
      },
      {
        title: "4) How to Manage Cookie Preferences",
        items: [
          "On your first visit, you can accept or reject analytics cookies via the cookie panel.",
          "You can later update your preferences from browser settings or the panel when shown again.",
          "Blocking all cookies through your browser may limit some functionality.",
        ],
      },
      {
        title: "5) Third-Party Services",
        items: [
          "Third-party providers we use for analytics and infrastructure may use their own technical cookies.",
          "These cookies are evaluated only for service operation or permitted analytics purposes.",
        ],
      },
    ],
    finalTitle: "6) Contact",
    finalParagraph:
      "For questions about cookie usage and your preferences, contact us:\nEmail: salimaka2014@gmail.com\nPhone: 0553 351 7769",
  },
} as const;

export default async function CookiesPage() {
  const locale = await resolveRequestLocale();
  const content = COOKIE_CONTENT[locale];

  return (
    <MarketingPageShell locale={locale}>
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{content.legalLabel}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">{content.title}</h1>
        <p className="mt-3 text-sm text-slate-600">{content.updatedAt}</p>
      </section>

      <SectionDivider label={content.sectionLabel} />

      <section className="grid gap-4">
        {content.sections.map((section) => (
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
        <h2 className="text-base font-extrabold text-slate-900 md:text-lg">{content.finalTitle}</h2>
        <p className="mt-3 whitespace-pre-line">{content.finalParagraph}</p>
      </section>
    </MarketingPageShell>
  );
}
