import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { getLandingPageBySlug } from "@/lib/seo-landings";
import { buildPageMetadata } from "@/lib/seo";

const data = getLandingPageBySlug("qr-menu-sistemi") ?? (() => {
  throw new Error("Landing content missing: qr-menu-sistemi");
})();

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle,
  description: data.seoDescription,
  path: "/qr-menu-sistemi",
  keywords: data.keywords,
});

export default function QrMenuSistemiPage() {
  return <SeoLandingPage data={data} />;
}
