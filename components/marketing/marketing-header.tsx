import { BrandLogoLink } from "@/components/ui/brand-logo-link";
import { LoadingLink } from "@/components/ui/loading-link";
import { MARKETING_NAV_LINKS, MarketingLink } from "@/lib/marketing-content";

type MarketingLocale = "tr" | "en";

interface MarketingHeaderProps {
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

const HEADER_COPY = {
  tr: {
    login: "Giriş",
    startFree: "Ücretsiz Başla",
  },
  en: {
    login: "Login",
    startFree: "Start Free",
  },
} as const;

export function MarketingHeader({ locale = "tr" }: MarketingHeaderProps) {
  const navLinks = NAV_LINKS[locale];
  const copy = HEADER_COPY[locale];
  const redirectingText = locale === "tr" ? "Yonlendiriliyor..." : "Redirecting...";

  return (
    <header className="relative z-10 border-b border-white/60 bg-white/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <BrandLogoLink />

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((item) => (
            <LoadingLink
              key={item.href}
              href={item.href}
              className="rounded-xl border border-transparent px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-200 hover:bg-white"
              loadingText={redirectingText}
            >
              {item.label}
            </LoadingLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LoadingLink
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            loadingText={redirectingText}
          >
            {copy.login}
          </LoadingLink>
          <LoadingLink
            href="/register"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            loadingText={redirectingText}
          >
            {copy.startFree}
          </LoadingLink>
        </div>
      </div>
    </header>
  );
}
