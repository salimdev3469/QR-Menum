import { LoadingLink } from "@/components/ui/loading-link";
import { PRICING_PLANS, PRICING_POLICY_ITEMS } from "@/lib/marketing-content";

export function PricingGrid() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/75 p-5 text-slate-900 shadow-sm backdrop-blur-sm md:p-8">
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Fiyatlandırma</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            İşletmene uygun planı seç, ihtiyacın kadar özellikle büyü
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Paketler modül bazlı ayrılır. Ürün varyasyonları, alerjen uyarıları, ürün etiketleri,
            promosyon yönetimi ve sosyal medya entegrasyonu işletme seviyene göre aktif edilir.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-right">
          <p className="text-xs font-semibold uppercase text-emerald-700">Deneme</p>
          <p className="text-lg font-extrabold text-slate-900">14 Gün Ücretsiz</p>
        </div>
      </div>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-4 ${
                plan.featured
                  ? "border-emerald-300 bg-emerald-50/90 shadow-[0_14px_24px_rgba(16,185,129,0.14)]"
                  : "border-slate-200 bg-white/90"
              }`}
            >
              {plan.featured ? (
                <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  En Popüler
                </span>
              ) : null}
              <h3 className="mt-3 text-lg font-extrabold">{plan.name}</h3>
              <p className="mt-1 text-xs text-slate-600">{plan.description}</p>

              <div className="mt-4">
                <p className="text-sm text-slate-500">Aylık</p>
                <p className="text-3xl font-extrabold">{plan.monthlyPrice}</p>
              </div>
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <p className="text-xs text-slate-500">Yıllık ödeme</p>
                <p className="text-lg font-extrabold">{plan.annualPrice}</p>
                <p className="text-[11px] text-emerald-700">{plan.annualNote}</p>
              </div>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <LoadingLink
                href={`/purchase?plan=${plan.name}`}
                className={`mt-5 inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-bold transition ${
                  plan.featured
                    ? "bg-emerald-500 text-white hover:bg-emerald-400"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
                loadingText="Yonlendiriliyor..."
              >
                {plan.cta}
              </LoadingLink>
            </article>
          ))}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-base font-extrabold">Fiyat Politikası</h3>
          <p className="mt-1 text-xs text-slate-600">
            Şartlar baştan nettir; gizli ücret veya sonradan çıkan sürpriz maliyet yoktur.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-700">
            {PRICING_POLICY_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-cyan-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <LoadingLink
            href="/purchase?plan=Growth"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"
            loadingText="Yonlendiriliyor..."
          >
            Planı Seç ve Başla
          </LoadingLink>
        </aside>
      </div>
    </div>
  );
}
