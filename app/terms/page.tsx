import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";
import { resolveRequestLocale } from "@/lib/request-locale";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | QR Menüm",
  description: "AKA YAZILIM tarafından sunulan QR Menüm kullanım koşulları.",
};

const TERMS_CONTENT = {
  tr: {
    legalLabel: "Yasal",
    title: "Kullanım Koşulları",
    updatedAt: "Son güncelleme: 20 Mayıs 2026",
    sectionLabel: "Koşullar",
    sections: [
      {
        title: "1) Kapsam ve Kabul",
        items: [
          "Bu koşullar, AKA YAZILIM tarafından sunulan QR Menüm platformunun tüm kullanıcıları için geçerlidir.",
          "Siteye erişen, hesap oluşturan veya hizmetten yararlanan kullanıcılar bu koşulları kabul etmiş sayılır.",
          "Kullanıcı bir işletme adına işlem yapıyorsa, ilgili işletmeyi temsile yetkili olduğunu beyan eder.",
        ],
      },
      {
        title: "2) Hizmetin Konusu",
        items: [
          "QR Menüm; restoran ve kafe işletmelerine dijital menü yayınlama, QR kod oluşturma ve içerik yönetimi imkanı sunar.",
          "Sunulan özellikler, seçilen paket, teknik gereksinimler ve ürün güncellemelerine göre farklılık gösterebilir.",
        ],
      },
      {
        title: "3) Hesap ve Güvenlik Sorumluluğu",
        items: [
          "Kullanıcı, hesap bilgilerinin doğru ve güncel olmasından sorumludur.",
          "Giriş bilgilerinin gizliliği kullanıcıya aittir; hesap üzerinden yapılan işlemler kullanıcının sorumluluğunda kabul edilir.",
          "Yetkisiz kullanım şüphesinde kullanıcı gecikmeden destek ekibine bildirim yapmalıdır.",
        ],
      },
      {
        title: "4) İçerik Sorumluluğu",
        items: [
          "Menüye yüklenen metin, görsel, fiyat, kampanya ve diğer içeriklerin hukuka uygunluğu tamamen kullanıcı sorumluluğundadır.",
          "Telif hakkını ihlal eden, yanıltıcı, mevzuata aykırı veya üçüncü kişilerin haklarını ihlal eden içerikler yasaktır.",
          "AKA YAZILIM, ihlal şüphesi bulunan içeriklerde kaldırma, erişimi kısıtlama veya hesap incelemesi başlatma hakkını saklı tutar.",
        ],
      },
      {
        title: "5) Ücretlendirme ve Satın Alım Süreci",
        items: [
          "Paket, dönem ve fiyat bilgileri satın alım ekranında kullanıcıya açık şekilde gösterilir.",
          "Platform üzerindeki satın alım adımı bir talep süreci olabilir; nihai sözleşme ve ödeme adımları satış ekibiyle tamamlanır.",
          "Ücretli planlarda yenileme, iptal ve kapsam koşulları kullanıcıya işlem öncesinde bildirilir.",
        ],
      },
      {
        title: "6) Yasaklı Kullanımlar",
        items: [
          "Sisteme izinsiz erişim girişimleri, güvenlik açıklarını suistimal etme ve hizmet kesintisi yaratmaya yönelik faaliyetler yasaktır.",
          "Kötü amaçlı yazılım yükleme, otomatik saldırı, veri kazıma veya altyapıyı zorlayacak işlemler tespit edildiğinde erişim engellenebilir.",
        ],
      },
      {
        title: "7) Askıya Alma ve Fesih",
        items: [
          "Bu koşullara aykırılık, güvenlik riski veya yasal zorunluluk durumlarında hizmet geçici veya kalıcı olarak durdurulabilir.",
          "Kullanıcı, hesabını kapatma veya hizmet sonlandırma taleplerini destek kanallarından iletebilir.",
        ],
      },
      {
        title: "8) Fikri Mülkiyet",
        items: [
          "Yazılım, tasarım, marka, logo ve tüm platform bileşenleri AKA YAZILIM'a aittir ve ilgili mevzuat kapsamında korunur.",
          "Kullanıcı içeriğinin mülkiyeti kullanıcıya aittir; ancak hizmetin sunulabilmesi için platform üzerinde işlenmesine izin verilir.",
        ],
      },
      {
        title: "9) Sorumluluğun Sınırı",
        items: [
          "AKA YAZILIM, hizmetin kesintisiz ve hatasız işlemesi için makul teknik özeni gösterir.",
          "Yasal sınırlar içinde kalmak kaydıyla, dolaylı zararlar, kar kaybı veya üçüncü taraf taleplerinden doğan sonuçlardan sorumluluk kabul edilmez.",
        ],
      },
    ],
    finalTitle: "10) Güncellemeler ve Uyuşmazlık",
    finalParagraphs: [
      "AKA YAZILIM, yasal gereklilikler veya ürün değişiklikleri doğrultusunda bu koşulları güncelleyebilir. Güncel metin bu sayfada yayımlanır ve yayımlandığı tarihten itibaren geçerli olur.",
      "Bu koşullara ilişkin uyuşmazlıklarda Türkiye Cumhuriyeti mevzuatı uygulanır; yetkili mahkeme ve icra daireleri İstanbul olarak kabul edilir.",
      "Yasal bildirim ve talepler için:\nE-posta: salimaka2014@gmail.com\nTelefon: 0553 351 7769",
    ],
  },
  en: {
    legalLabel: "Legal",
    title: "Terms of Use",
    updatedAt: "Last updated: May 20, 2026",
    sectionLabel: "Terms",
    sections: [
      {
        title: "1) Scope and Acceptance",
        items: [
          "These terms apply to all users of the QR Menüm platform provided by AKA YAZILIM.",
          "Users who access the site, create an account, or use the service are deemed to have accepted these terms.",
          "If a user acts on behalf of a business, they declare they are authorized to represent that business.",
        ],
      },
      {
        title: "2) Service Scope",
        items: [
          "QR Menüm provides restaurants and cafes with digital menu publishing, QR code generation, and content management.",
          "Available features may vary based on the selected plan, technical requirements, and product updates.",
        ],
      },
      {
        title: "3) Account and Security Responsibility",
        items: [
          "The user is responsible for keeping account information accurate and up to date.",
          "Credential confidentiality belongs to the user; actions taken through the account are considered the user's responsibility.",
          "In case of suspected unauthorized use, the user must promptly notify the support team.",
        ],
      },
      {
        title: "4) Content Responsibility",
        items: [
          "The legality of text, visuals, prices, promotions, and other uploaded content is entirely the user's responsibility.",
          "Content that infringes copyright, is misleading, violates regulations, or infringes third-party rights is prohibited.",
          "AKA YAZILIM reserves the right to remove content, restrict access, or initiate account review in case of suspected violations.",
        ],
      },
      {
        title: "5) Pricing and Purchase Process",
        items: [
          "Plan, period, and pricing details are clearly shown to the user on the purchase screen.",
          "The purchase step on the platform may be a request flow; final contract and payment steps are completed with the sales team.",
          "For paid plans, renewal, cancellation, and scope conditions are communicated before the transaction.",
        ],
      },
      {
        title: "6) Prohibited Use",
        items: [
          "Unauthorized access attempts, abuse of security vulnerabilities, and activities aimed at service disruption are prohibited.",
          "Access may be blocked when malware uploads, automated attacks, data scraping, or infrastructure-abusive operations are detected.",
        ],
      },
      {
        title: "7) Suspension and Termination",
        items: [
          "The service may be temporarily or permanently suspended in cases of violation of these terms, security risk, or legal obligation.",
          "Users may submit account closure or service termination requests through support channels.",
        ],
      },
      {
        title: "8) Intellectual Property",
        items: [
          "Software, design, trademark, logo, and all platform components belong to AKA YAZILIM and are protected under applicable law.",
          "Ownership of user content remains with the user; however, processing on the platform is permitted to provide the service.",
        ],
      },
      {
        title: "9) Limitation of Liability",
        items: [
          "AKA YAZILIM applies reasonable technical care for uninterrupted and error-free service operation.",
          "To the extent permitted by law, liability is not accepted for indirect damages, loss of profit, or outcomes arising from third-party claims.",
        ],
      },
    ],
    finalTitle: "10) Updates and Disputes",
    finalParagraphs: [
      "AKA YAZILIM may update these terms in line with legal requirements or product changes. The current text is published on this page and becomes effective on its publication date.",
      "In disputes related to these terms, the laws of the Republic of Türkiye apply, and Istanbul courts and enforcement offices are deemed competent.",
      "For legal notices and requests:\nEmail: salimaka2014@gmail.com\nPhone: 0553 351 7769",
    ],
  },
} as const;

export default async function TermsPage() {
  const locale = await resolveRequestLocale();
  const content = TERMS_CONTENT[locale];

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
