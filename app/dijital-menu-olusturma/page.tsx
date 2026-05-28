import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { getLandingPageBySlug } from "@/lib/seo-landings";
import { buildPageMetadata } from "@/lib/seo";

const data = getLandingPageBySlug("dijital-menu-olusturma") ?? (() => {
  throw new Error("Landing content missing: dijital-menu-olusturma");
})();

export const metadata: Metadata = buildPageMetadata({
  title: data.seoTitle,
  description: data.seoDescription,
  path: "/dijital-menu-olusturma",
  keywords: data.keywords,
});

export default function DijitalMenuOlusturmaPage() {
  return <SeoLandingPage data={data} />;
}
