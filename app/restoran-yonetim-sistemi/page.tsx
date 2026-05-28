import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { getLandingPageBySlug } from "@/lib/seo-landings";
import { buildPageMetadata } from "@/lib/seo";

const data = getLandingPageBySlug("restoran-yonetim-sistemi") ?? (() => {
  throw new Error("Landing content missing: restoran-yonetim-sistemi");
})();

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle,
  description: data.seoDescription,
  path: "/restoran-yonetim-sistemi",
  keywords: data.keywords,
});

export default function RestoranYonetimSistemiPage() {
  return <SeoLandingPage data={data} />;
}
