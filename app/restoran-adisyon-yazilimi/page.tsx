import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { getLandingPageBySlug } from "@/lib/seo-landings";
import { buildPageMetadata } from "@/lib/seo";

const data = getLandingPageBySlug("restoran-adisyon-yazilimi") ?? (() => {
  throw new Error("Landing content missing: restoran-adisyon-yazilimi");
})();

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle,
  description: data.seoDescription,
  path: "/restoran-adisyon-yazilimi",
  keywords: data.keywords,
});

export default function RestoranAdisyonYazilimiPage() {
  return <SeoLandingPage data={data} />;
}
