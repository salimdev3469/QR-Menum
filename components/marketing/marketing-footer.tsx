import Link from "next/link";

import { LoadingLink } from "@/components/ui/loading-link";
import { CONTACT_CHANNELS, MARKETING_NAV_LINKS, MarketingLink } from "@/lib/marketing-content";

type MarketingLocale = "tr" | "en";

interface ContactChannel {
  label: string;
  value: string;
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
  tr: CONTACT_CHANNELS,
  en: [
    { label: "Email", value: "salimaka2014@gmail.com" },
    { label: "Phone", value: "0553 351 7769" },
    { label: "Working Hours", value: "Weekdays 09:00 - 18:00" },
  ],
};

const LEGAL_LINKS: Record<MarketingLocale, MarketingLink[]> = {
  tr: [
    { href: "/privacy", label: "Gizlilik Politikası" },
    { href: "/terms", label: "Kullanım Koşulları" },
  ],
  en: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
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
    rights: "All rights reserved by AKA YAZILIM.",
    marketNote: "Built for the Turkish market.",
  },
} as const;

export function MarketingFooter({ locale = "tr" }: MarketingFooterProps) {
  const navLinks = NAV_LINKS[locale];
  const contactChannels = CONTACT_CHANNELS_BY_LOCALE[locale];
  const legalLinks = LEGAL_LINKS[locale];
  const copy = FOOTER_COPY[locale];

  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-slate-900">QR Menüm</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{copy.description}</p>
          <div className="mt-4 flex gap-2">
            <LoadingLink
              href="/register"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              loadingText={locale === "tr" ? "Yonlendiriliyor..." : "Redirecting..."}
            >
              {copy.primaryCta}
            </LoadingLink>
            <LoadingLink
              href="/contact"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100"
              loadingText={locale === "tr" ? "Yonlendiriliyor..." : "Redirecting..."}
            >
              {copy.secondaryCta}
            </LoadingLink>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.sitemapTitle}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-semibold text-slate-700 hover:text-emerald-700">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/faq" className="font-semibold text-slate-700 hover:text-emerald-700">
                {copy.faqLabel}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{copy.contactAndLegalTitle}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {contactChannels.map((channel) => (
              <li key={channel.label}>
                <span className="font-semibold">{channel.label}: </span>
                {channel.value}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="font-semibold text-slate-700 hover:text-emerald-700">
                {link.label}
              </Link>
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
