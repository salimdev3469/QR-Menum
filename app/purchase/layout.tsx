import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbJsonLd, buildJsonLd, toAbsoluteUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "QR Menü Sistemi Satın Alımı",
  description:
    "QR Menüm sistem satın alım talebi oluşturun, restoranınız için uygun planı satış ekibiyle netleştirin.",
  path: "/purchase",
  keywords: ["qr menü satın al", "restoran yazılımı satın al", "qr menü fiyatlandırma"],
});

export default function PurchaseLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Sistem Satın Alımı", path: "/purchase" },
  ]);

  const softwareJsonLd = buildJsonLd("SoftwareApplication", {
    name: "QR Menüm",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      url: toAbsoluteUrl("/purchase"),
      priceCurrency: "TRY",
      price: "1490",
      availability: "https://schema.org/InStock",
    },
  });

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd, softwareJsonLd]} />
      {children}
    </>
  );
}
