"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { LoadingLink } from "@/components/ui/loading-link";

interface StandShowcaseSectionProps {
  sectionLabel: string;
  title: string;
  description: string;
  imageAlt: string;
  primaryCta: string;
  secondaryCta: string;
  ctaLoadingText: string;
  featurePills: string[];
}

export function StandShowcaseSection({
  sectionLabel,
  title,
  description,
  imageAlt,
  primaryCta,
  secondaryCta,
  ctaLoadingText,
  featurePills,
}: StandShowcaseSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`stand-reveal-section ${isRevealed ? "is-revealed" : ""}`}>
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 p-4 shadow-[0_16px_44px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-6 lg:p-7">
        <div className="relative grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="stand-reveal-media relative overflow-hidden rounded-[1.75rem] border border-slate-200/90 bg-white shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
            <div className="pointer-events-none absolute inset-x-8 bottom-2 z-0 h-12 rounded-full bg-slate-400/25 blur-2xl" />
            <Image
              src="/qr_stand.png"
              alt={imageAlt}
              width={1122}
              height={1402}
              className="relative z-[1] h-full w-full object-cover"
            />
          </div>

          <div className="stand-reveal-content relative rounded-[1.75rem] border border-slate-200/90 bg-white/94 p-6 shadow-[0_16px_36px_rgba(15,23,42,0.1)] backdrop-blur md:p-8">
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />

            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{sectionLabel}</p>
            <h2 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">{description}</p>

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

            <div className="mt-6 flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
