import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Gizlilik Politikası",
  description: "AKA YAZILIM tarafından sunulan QR Menüm gizlilik politikası.",
  path: "/privacy",
});

const PRIVACY_CONTENT = {
  tr: {
    legalLabel: "Yasal",
    title: "Gizlilik Politikası",
    updatedAt: "Son güncelleme: 20 Mayıs 2026",
    sectionLabel: "Politika",
    sections: [
      {
        title: "1) Toplanan Veriler",
        items: [
          "Hesap açılışı ve giriş süreçlerinde ad-soyad, e-posta, telefon, işletme bilgileri ve kimlik doğrulama kayıtları işlenir.",
          "Menü ürünleri, kategori bilgileri, görseller, kampanyalar ve QR kod yapılandırmaları gibi kullanıcı tarafından eklenen içerikler saklanır.",
          "Uygulama güvenliği ve performansı için oturum, cihaz, hata ve işlem logları sınırlı kapsamda tutulur.",
          "Destek taleplerinde tarafımıza ilettiğiniz mesajlar ve iletişim kayıtları hizmet kalitesi amacıyla kaydedilebilir.",
        ],
      },
      {
        title: "2) Verilerin Kullanım Amaçları",
        items: [
          "Hizmeti sunmak, hesabınızı yönetmek ve menünüzü yayınlamak.",
          "QR menü bağlantılarının çalışmasını sağlamak ve panel deneyimini iyileştirmek.",
          "Talep, destek, bildirim ve güvenlik süreçlerini yürütmek.",
          "Yasal yükümlülükleri yerine getirmek ve suistimal/kötüye kullanım risklerini önlemek.",
          "Analitik çerezlere izin verilmişse, kullanım ölçümleri ile ürün geliştirme yapmak.",
        ],
      },
      {
        title: "3) Veri Paylaşımı ve Aktarım",
        items: [
          "Kişisel verileriniz satılmaz, kiralanmaz veya ticari amaçla üçüncü kişilere devredilmez.",
          "Hizmet altyapısının çalışması için barındırma, kimlik doğrulama, depolama ve e-posta hizmet sağlayıcılarıyla sınırlı paylaşım yapılabilir.",
          "Yetkili kamu kurumları tarafından usulüne uygun talep gelmesi halinde, yasal zorunluluk kapsamında bilgi paylaşımı yapılabilir.",
          "Kullanılan altyapıya bağlı olarak veriler yurt içi veya yurt dışındaki güvenli bulut sistemlerinde işlenebilir.",
        ],
      },
      {
        title: "4) Saklama Süresi ve Silme",
        items: [
          "Veriler, hizmetin sunumu için gerekli olduğu süre boyunca ve ilgili mevzuatın öngördüğü saklama süreleri kadar tutulur.",
          "Hesap kapanışı veya silme talebi sonrasında, hukuki zorunluluk bulunmayan veriler makul süre içinde anonimleştirilir veya silinir.",
          "Yedekleme kayıtları teknik gereklilikler nedeniyle sınırlı bir süre daha sistemlerde kalabilir.",
        ],
      },
      {
        title: "5) Çerezler",
        items: [
          "Zorunlu çerezler güvenlik, oturum sürekliliği ve temel işlevler için her zaman aktiftir.",
          "Analitik çerezler yalnızca onay verdiğiniz durumda kullanılır; tercihinizi çerez panelinden dilediğiniz zaman güncelleyebilirsiniz.",
        ],
      },
      {
        title: "6) Kullanıcı Hakları",
        items: [
          "KVKK kapsamında kişisel verilerinize erişme, düzeltme, silme, işlenmesini sınırlama ve itiraz etme haklarına sahipsiniz.",
          "Hak taleplerinizi aşağıdaki iletişim kanallarından iletebilir, başvurunuzun sonucunu yasal sürelerde alabilirsiniz.",
        ],
      },
    ],
    finalTitle: "7) İletişim",
    finalParagraphs: [
      "Gizlilik talepleri ve kişisel veri başvuruları için bize şu kanallardan ulaşabilirsiniz:\nE-posta: salimaka2014@gmail.com\nTelefon: 0553 351 7769",
      "Bu politika, hizmetteki değişiklikler ve yasal gereklilikler doğrultusunda güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.",
    ],
  },
  en: {
    legalLabel: "Legal",
    title: "Privacy Policy",
    updatedAt: "Last updated: May 20, 2026",
    sectionLabel: "Policy",
    sections: [
      {
        title: "1) Data We Collect",
        items: [
          "During account registration and login, name, email, phone, business details, and authentication records are processed.",
          "User-added content such as menu items, category data, visuals, campaigns, and QR configuration is stored.",
          "For app security and performance, session, device, error, and transaction logs are retained in limited scope.",
          "Messages and communication records sent in support requests may be recorded for service quality purposes.",
        ],
      },
      {
        title: "2) Purposes of Data Use",
        items: [
          "To provide the service, manage your account, and publish your menu.",
          "To keep QR menu links functional and improve panel experience.",
          "To run request, support, notification, and security processes.",
          "To meet legal obligations and prevent abuse/misuse risks.",
          "When analytics cookies are allowed, to improve the product through usage metrics.",
        ],
      },
      {
        title: "3) Data Sharing and Transfer",
        items: [
          "Your personal data is not sold, rented, or transferred to third parties for commercial purposes.",
          "Limited sharing may occur with hosting, authentication, storage, and email providers required for service operation.",
          "Information may be shared with authorized public authorities when legally required and duly requested.",
          "Depending on infrastructure, data may be processed in secure domestic or international cloud systems with safeguards appropriate to GDPR transfer requirements.",
        ],
      },
      {
        title: "4) Retention and Deletion",
        items: [
          "Data is retained for as long as required to provide the service and within statutory retention periods.",
          "After account closure or deletion request, data without legal retention obligations is anonymized or deleted within a reasonable time.",
          "Backup records may remain in systems for a limited period due to technical requirements.",
        ],
      },
      {
        title: "5) Cookies",
        items: [
          "Mandatory cookies are always active for security, session continuity, and core functionality.",
          "Analytics cookies are used only with your consent; you can update your preference anytime from the cookie panel.",
        ],
      },
      {
        title: "6) User Rights (GDPR)",
        items: [
          "Under GDPR, you have rights to access, correct, delete, restrict processing of, object to processing, and request portability of your personal data where applicable.",
          "You can submit your requests through the contact channels below and receive a response within legal timeframes.",
        ],
      },
    ],
    finalTitle: "7) Contact",
    finalParagraphs: [
      "For privacy requests and personal data applications, you can reach us via:\nEmail: salimaka2014@gmail.com\nPhone: 0553 351 7769",
      "This policy may be updated in line with service changes and legal requirements. The latest version is always published on this page.",
    ],
  },
} as const;

export default async function PrivacyPage() {
  const content = PRIVACY_CONTENT.tr;

  return (
    <MarketingPageShell locale="tr">
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
        {content.finalParagraphs.map((paragraph) => (
          <p key={paragraph} className="mt-3 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </section>
    </MarketingPageShell>
  );
}
