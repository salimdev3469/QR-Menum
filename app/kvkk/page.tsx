import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | QR Menüm",
  description: "QR Menüm kişisel veri işleme süreçlerine ilişkin KVKK aydınlatma metni.",
};

const KVKK_SECTIONS = [
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
] as const;

export default function KvkkPage() {
  return (
    <MarketingPageShell>
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Yasal</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">KVKK Aydınlatma Metni</h1>
        <p className="mt-3 text-sm text-slate-600">Son güncelleme: 21 Mayıs 2026</p>
      </section>

      <SectionDivider label="KVKK" />

      <section className="grid gap-4">
        {KVKK_SECTIONS.map((section) => (
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
        <h2 className="text-base font-extrabold text-slate-900 md:text-lg">7) Başvuru ve İletişim</h2>
        <p className="mt-3">
          KVKK kapsamındaki hak taleplerinizi bize aşağıdaki kanallardan iletebilirsiniz:
          <br />
          E-posta: <span className="font-semibold">salimaka2014@gmail.com</span>
          <br />
          Telefon: <span className="font-semibold">0553 351 7769</span>
        </p>
        <p className="mt-3">
          Bu metin genel bilgilendirme amacı taşır ve hizmet değişiklikleri ile mevzuat güncellemelerine göre yenilenebilir.
        </p>
      </section>
    </MarketingPageShell>
  );
}
