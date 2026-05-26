import Image from "next/image";

import { LoadingLink } from "@/components/ui/loading-link";

interface StandProductCard {
  id: string;
  title: string;
  priceLabel: string;
  imageSrc: string;
  imageAlt: string;
}

interface StandShowcaseSectionProps {
  sectionLabel: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  ctaLoadingText: string;
  featurePills: string[];
  productCards: StandProductCard[];
}

export function StandShowcaseSection({
  sectionLabel,
  title,
  description,
  primaryCta,
  secondaryCta,
  ctaLoadingText,
  featurePills,
  productCards,
}: StandShowcaseSectionProps) {
  return (
    <section>
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_6%,rgba(16,185,129,0.14),transparent_28%),radial-gradient(circle_at_90%_8%,rgba(14,165,233,0.1),transparent_34%)]" />

        <div className="relative rounded-[1.6rem] border border-slate-200/90 bg-white/95 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] md:p-8">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />

          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{sectionLabel}</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
            {title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">{description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {featurePills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-[0_3px_10px_rgba(15,23,42,0.06)]"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {productCards.map((card) => (
              <article
                key={card.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.14)]"
              >
                <div className="relative aspect-[5/4] overflow-hidden bg-[linear-gradient(150deg,#f8fbfd,#f2f6fa)]">
                  <div className="absolute inset-x-6 bottom-2 h-10 rounded-full bg-slate-300/25 blur-xl" />
                  <Image
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="relative z-[1] object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="border-t border-slate-200 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-700">{card.title}</p>
                  <p className="mt-1 text-[1.85rem] font-extrabold leading-none tracking-tight text-slate-900">
                    {card.priceLabel}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <LoadingLink
              href="/stands"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
              loadingText={ctaLoadingText}
            >
              {primaryCta}
            </LoadingLink>
            <LoadingLink
              href="/purchase"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              loadingText={ctaLoadingText}
            >
              {secondaryCta}
            </LoadingLink>
          </div>
        </div>
      </div>
    </section>
  );
}
