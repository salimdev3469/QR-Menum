import type { Metadata } from "next";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { SectionDivider } from "@/components/marketing/section-divider";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | QR Menüm",
  description: "AKA YAZILIM tarafından sunulan QR Menüm kullanım koşulları.",
};

const TERMS_SECTIONS = [
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
] as const;

export default function TermsPage() {
  return (
    <MarketingPageShell>
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Yasal</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Kullanım Koşulları
        </h1>
        <p className="mt-3 text-sm text-slate-600">Son güncelleme: 20 Mayıs 2026</p>
      </section>

      <SectionDivider label="Koşullar" />

      <section className="grid gap-4">
        {TERMS_SECTIONS.map((section) => (
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

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-sm leading-relaxed text-slate-700">
        <h2 className="text-base font-extrabold text-slate-900 md:text-lg">10) Güncellemeler ve Uyuşmazlık</h2>
        <p className="mt-3">
          AKA YAZILIM, yasal gereklilikler veya ürün değişiklikleri doğrultusunda bu koşulları güncelleyebilir. Güncel
          metin bu sayfada yayımlanır ve yayımlandığı tarihten itibaren geçerli olur.
        </p>
        <p className="mt-3">
          Bu koşullara ilişkin uyuşmazlıklarda Türkiye Cumhuriyeti mevzuatı uygulanır; yetkili mahkeme ve icra daireleri
          İstanbul olarak kabul edilir.
        </p>
        <p className="mt-3">
          Yasal bildirim ve talepler için:
          <br />
          E-posta: <span className="font-semibold">salimaka2014@gmail.com</span>
          <br />
          Telefon: <span className="font-semibold">0553 351 7769</span>
        </p>
      </section>
    </MarketingPageShell>
  );
}
