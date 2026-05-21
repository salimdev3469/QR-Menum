"use client";

import { usePathname } from "next/navigation";

import { LoadingLink } from "@/components/ui/loading-link";
import { BrandLogoLink } from "@/components/ui/brand-logo-link";
import { useLocale } from "@/hooks/use-locale";
import { CONTACT_CHANNELS, MARKETING_NAV_LINKS, MarketingLink } from "@/lib/marketing-content";

type MarketingLocale = "tr" | "en";

interface ContactChannel {
  label: string;
  value: string;
  href?: string;
}

interface MarketingFooterProps {
  locale?: MarketingLocale;
}

const NAV_LINKS: Record<MarketingLocale, MarketingLink[]> = {
  tr: MARKETING_NAV_LINKS,
  en: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/stands", label: "QR Stands" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
};

const CONTACT_CHANNELS_BY_LOCALE: Record<MarketingLocale, ContactChannel[]> = {
  tr: CONTACT_CHANNELS.map((channel) => {
    if (channel.label === "E-posta") {
      return { ...channel, href: "mailto:salimaka2014@gmail.com" };
    }

    if (channel.label === "Telefon") {
      return { ...channel, href: "tel:+905533517769" };
    }

    return channel;
  }),
  en: [
    { label: "Email", value: "salimaka2014@gmail.com", href: "mailto:salimaka2014@gmail.com" },
    { label: "Phone", value: "0553 351 7769", href: "tel:+905533517769" },
    { label: "Working Hours", value: "Weekdays 09:00 - 18:00" },
  ],
};

const LEGAL_LINKS: Record<MarketingLocale, MarketingLink[]> = {
  tr: [
    { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
    { href: "/privacy", label: "Gizlilik Politikası" },
    { href: "/terms", label: "Kullanım Koşulları" },
    { href: "/cookies", label: "Çerez Politikası" },
  ],
  en: [
    { href: "/kvkk", label: "GDPR Data Notice" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

const FOOTER_COPY = {
  tr: {
    description: "Restoran ve kafeler için hızlı, sade ve satış odaklı dijital menü yönetim platformu.",
    primaryCta: "Hemen Başla",
    secondaryCta: "İletişim",
    sitemapTitle: "Site Haritası",
    faqLabel: "SSS",
    contactAndLegalTitle: "İletişim & Yasal",
    linkLoadingText: "Yonlendiriliyor...",
    rights: "Tüm hakları AKA YAZILIM'a aittir.",
    marketNote: "Türkiye pazarı için hazırlanmıştır.",
  },
  en: {
    description: "Fast, simple, and sales-focused digital menu management platform for restaurants and cafes.",
    primaryCta: "Start Now",
    secondaryCta: "Contact",
    sitemapTitle: "Sitemap",
    faqLabel: "FAQ",
    contactAndLegalTitle: "Contact & Legal",
    linkLoadingText: "Redirecting...",
    rights: "All rights reserved by AKA YAZILIM.",
    marketNote: "International GDPR and USD pricing view enabled.",
  },
} as const;

export function MarketingFooter({ locale }: MarketingFooterProps) {
  const { locale: appLocale } = useLocale();
  const resolvedLocale: MarketingLocale = locale ?? (appLocale === "tr" ? "tr" : "en");
  const pathname = usePathname();
  const navLinks = NAV_LINKS[resolvedLocale];
  const contactChannels = CONTACT_CHANNELS_BY_LOCALE[resolvedLocale];
  const legalLinks = LEGAL_LINKS[resolvedLocale];
  const copy = FOOTER_COPY[resolvedLocale];
  const allSitemapLinks = [...navLinks, { href: "/faq", label: copy.faqLabel }];

  const isActiveLink = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <footer className="relative z-10 mt-16 border-t border-slate-200/80 bg-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <BrandLogoLink className="w-fit" labelClassName="text-lg" />
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{copy.description}</p>
          <div className="mt-4 flex gap-2">
            <LoadingLink
              href="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              loadingText={copy.linkLoadingText}
            >
              {copy.primaryCta}
            </LoadingLink>
            <LoadingLink
              href="/contact"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100"
              loadingText={copy.linkLoadingText}
            >
              {copy.secondaryCta}
            </LoadingLink>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.sitemapTitle}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {allSitemapLinks.map((item) => (
              <li key={item.href}>
                <LoadingLink
                  href={item.href}
                  loadingText={copy.linkLoadingText}
                  className={`inline-flex rounded-md px-1.5 py-1 font-semibold transition ${
                    isActiveLink(item.href)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-100 hover:text-emerald-700"
                  }`}
                >
                  {item.label}
                </LoadingLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.contactAndLegalTitle}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {contactChannels.map((channel) => (
              <li key={channel.label}>
                <span className="font-semibold">{channel.label}: </span>
                {channel.href ? (
                  <a href={channel.href} className="hover:text-emerald-700">
                    {channel.value}
                  </a>
                ) : (
                  channel.value
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {legalLinks.map((link) => (
              <LoadingLink
                key={link.href}
                href={link.href}
                loadingText={copy.linkLoadingText}
                className={`rounded-full border px-3 py-1.5 font-semibold transition ${
                  isActiveLink(link.href)
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-200 hover:text-emerald-700"
                }`}
              >
                {link.label}
              </LoadingLink>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/80 bg-white/80">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} QR Menüm. {copy.rights}
          </span>
          <span>{copy.marketNote}</span>
        </div>
      </div>
    </footer>
  );
}
