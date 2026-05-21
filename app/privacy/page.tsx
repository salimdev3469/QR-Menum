import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | QR Menüm",
  description: "AKA YAZILIM tarafından sunulan QR Menüm gizlilik politikası.",
};

const PRIVACY_SECTIONS = [
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
] as const;

export default function PrivacyPage() {
  return (
    <MarketingPageShell>
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Yasal</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Gizlilik Politikası
        </h1>
        <p className="mt-3 text-sm text-slate-600">Son güncelleme: 20 Mayıs 2026</p>
      </section>

      <SectionDivider label="Politika" />

      <section className="grid gap-4">
        {PRIVACY_SECTIONS.map((section) => (
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
        <h2 className="text-base font-extrabold text-slate-900 md:text-lg">7) İletişim</h2>
        <p className="mt-3">
          Gizlilik talepleri ve kişisel veri başvuruları için bize şu kanallardan ulaşabilirsiniz:
          <br />
          E-posta: <span className="font-semibold">salimaka2014@gmail.com</span>
          <br />
          Telefon: <span className="font-semibold">0553 351 7769</span>
        </p>
        <p className="mt-3">
          Bu politika, hizmetteki değişiklikler ve yasal gereklilikler doğrultusunda güncellenebilir. Güncel sürüm her
          zaman bu sayfada yayımlanır.
        </p>
      </section>
    </MarketingPageShell>
  );
}
