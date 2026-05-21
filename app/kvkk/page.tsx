import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";
import { resolveRequestLocaleContext } from "@/lib/request-locale";

const LEGAL_DISCLOSURE_CONTENT = {
  tr: {
    legalLabel: "Yasal",
    title: "KVKK Aydınlatma Metni",
    updatedAt: "Son güncelleme: 21 Mayıs 2026",
    sectionLabel: "KVKK",
    sections: [
      {
        title: "1) Veri Sorumlusu",
        items: [
          "Bu aydınlatma metni, AKA YAZILIM tarafından veri sorumlusu sıfatıyla hazırlanmıştır.",
          "QR Menüm platformunu kullanan gerçek kişi kullanıcıların kişisel verileri, 6698 sayılı KVKK kapsamında işlenir.",
        ],
      },
      {
        title: "2) İşlenen Kişisel Veri Kategorileri",
        items: [
          "Kimlik ve iletişim verileri: ad-soyad, e-posta, telefon, işletme iletişim bilgileri.",
          "İşlem güvenliği verileri: oturum kayıtları, giriş-çıkış zamanları, IP, cihaz ve hata logları.",
          "Hizmet kullanım verileri: menü içerikleri, QR bağlantıları, yayın tercihleri ve panel ayarları.",
        ],
      },
      {
        title: "3) Kişisel Verilerin İşlenme Amaçları",
        items: [
          "Platform üyeliğini oluşturmak, hesabı doğrulamak ve hizmeti güvenli şekilde sunmak.",
          "Teknik destek, bildirim, operasyon ve müşteri ilişkileri süreçlerini yürütmek.",
          "Yasal yükümlülükleri yerine getirmek, suistimal ve güvenlik risklerini önlemek.",
          "Açık rıza verilmesi halinde performans ve ürün geliştirme analizleri yapmak.",
        ],
      },
      {
        title: "4) Veri Aktarımı",
        items: [
          "Veriler, hizmetin çalışması için kullanılan barındırma, depolama, kimlik doğrulama ve e-posta servis sağlayıcılarına aktarılabilir.",
          "Yasal zorunluluk halinde yetkili kamu kurum ve kuruluşlarına bilgi paylaşımı yapılabilir.",
          "Aktarımlar, KVKK'nın 8 ve 9. maddeleri kapsamında uygun teknik ve idari tedbirlerle gerçekleştirilir.",
        ],
      },
      {
        title: "5) Toplama Yöntemi ve Hukuki Sebep",
        items: [
          "Veriler; kayıt formları, panel işlemleri, çerez tercihleri, destek talepleri ve otomatik log mekanizmaları üzerinden toplanır.",
          "İşleme faaliyetleri; sözleşmenin kurulması/ifası, hukuki yükümlülüklerin yerine getirilmesi, meşru menfaat ve açık rıza hukuki sebeplerine dayanır.",
        ],
      },
      {
        title: "6) İlgili Kişi Hakları (KVKK Madde 11)",
        items: [
          "Kişisel verinizin işlenip işlenmediğini öğrenme ve bilgi talep etme.",
          "Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme.",
          "Şartları oluştuğunda verilerin silinmesini veya yok edilmesini talep etme.",
          "İşlemeye itiraz etme ve otomatik analizlere karşı hak kullanma.",
          "Kanuna aykırı işlem nedeniyle zarara uğranması halinde tazminat talep etme.",
        ],
      },
    ],
    finalTitle: "7) Başvuru ve İletişim",
    finalParagraphs: [
      "KVKK kapsamındaki hak taleplerinizi bize aşağıdaki kanallardan iletebilirsiniz:\nE-posta: salimaka2014@gmail.com\nTelefon: 0553 351 7769",
      "Bu metin genel bilgilendirme amacı taşır ve hizmet değişiklikleri ile mevzuat güncellemelerine göre yenilenebilir.",
    ],
  },
  international: {
    legalLabel: "Legal",
    title: "GDPR Data Protection Notice",
    updatedAt: "Last updated: May 21, 2026",
    sectionLabel: "GDPR",
    sections: [
      {
        title: "1) Data Controller",
        items: [
          "This notice is provided by AKA YAZILIM as the data controller for QR Menüm services.",
          "For visitors and customers outside Türkiye, personal data processing is aligned with the principles of Regulation (EU) 2016/679 (GDPR).",
        ],
      },
      {
        title: "2) Categories of Personal Data Processed",
        items: [
          "Identity and contact data: full name, email, phone, and business contact details.",
          "Transaction security data: session records, login/logout timestamps, IP, device, and error logs.",
          "Service usage data: menu content, QR links, publishing preferences, and panel settings.",
        ],
      },
      {
        title: "3) Purposes and Legal Bases of Processing",
        items: [
          "To create and manage your account, verify identity, and deliver the requested service (GDPR Art. 6(1)(b)).",
          "To run support, operations, abuse prevention, and platform security controls based on legitimate interests (GDPR Art. 6(1)(f)).",
          "To fulfill legal obligations including accounting, tax, and regulatory duties (GDPR Art. 6(1)(c)).",
          "To run optional analytics and product-improvement activities where consent is required (GDPR Art. 6(1)(a)).",
        ],
      },
      {
        title: "4) Data Transfers and International Processing",
        items: [
          "Data may be transferred to hosting, storage, authentication, and email service providers used for service operation.",
          "Information may be shared with authorized public institutions and organizations when legally required.",
          "When personal data is transferred outside the EEA, appropriate safeguards such as contractual protections and security controls are applied in line with GDPR Chapter V.",
        ],
      },
      {
        title: "5) Collection Methods and Retention",
        items: [
          "Data is collected through registration forms, panel actions, cookie preferences, support requests, and automated logging mechanisms.",
          "Data is retained only for as long as necessary for service delivery, legal obligations, and security/audit needs, then deleted or anonymized.",
        ],
      },
      {
        title: "6) Data Subject Rights (GDPR Articles 15-22)",
        items: [
          "Right of access, rectification, and erasure.",
          "Right to restriction of processing and right to object to processing.",
          "Right to data portability where applicable.",
          "Right to withdraw consent at any time for consent-based processing.",
          "Right not to be subject to solely automated decisions where legally applicable.",
        ],
      },
      {
        title: "7) Complaints and Supervisory Authorities",
        items: [
          "You may submit privacy requests directly to us through the contact channels below.",
          "You may also lodge a complaint with your local supervisory authority in your jurisdiction when applicable.",
        ],
      },
    ],
    finalTitle: "8) Contact",
    finalParagraphs: [
      "For GDPR and privacy requests, contact us via:\nEmail: salimaka2014@gmail.com\nPhone: 0553 351 7769",
      "This notice provides a general disclosure framework and may be updated in line with service changes and legal requirements.",
    ],
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const requestContext = await resolveRequestLocaleContext();

  if (requestContext.market === "tr") {
    return {
      title: "KVKK Aydınlatma Metni | QR Menüm",
      description: "QR Menüm kişisel veri işleme süreçlerine ilişkin KVKK aydınlatma metni.",
    };
  }

  return {
    title: "GDPR Data Protection Notice | QR Menüm",
    description: "GDPR-focused data protection notice for visitors and customers outside Türkiye.",
  };
}

export default async function KvkkPage() {
  const requestContext = await resolveRequestLocaleContext();
  const { locale, market } = requestContext;
  const content = market === "tr" ? LEGAL_DISCLOSURE_CONTENT.tr : LEGAL_DISCLOSURE_CONTENT.international;

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
        {content.finalParagraphs.map((paragraph) => (
          <p key={paragraph} className="mt-3 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </section>
    </MarketingPageShell>
  );
}
