import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { getLandingPageBySlug } from "@/lib/seo-landings";
import { buildPageMetadata } from "@/lib/seo";

const data = getLandingPageBySlug("garson-cagirma-sistemi") ?? (() => {
  throw new Error("Landing content missing: garson-cagirma-sistemi");
})();

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle,
  description: data.seoDescription,
  path: "/garson-cagirma-sistemi",
  keywords: data.keywords,
});

export default function GarsonCagirmaSistemiPage() {
  return <SeoLandingPage data={data} />;
}
