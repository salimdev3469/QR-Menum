import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "QR Stant Siparişi",
  description:
    "Masa sayınıza uygun QR stant siparişi verin, hazır tasarım seçin veya kendi tasarımınızı yükleyin.",
  path: "/stands",
  keywords: ["qr stant siparişi", "masa qr stand", "restoran qr stant"],
});

export default function StandsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "QR Stant Siparişi", path: "/stands" },
  ]);

  const productJsonLd = buildJsonLd("Product", {
    name: "QR Masa Stantları",
    category: "Restaurant QR Stand",
    description: "Restoran masaları için QR stant sipariş çözümü.",
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: "50",
      availability: "https://schema.org/InStock",
    },
  });

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd, productJsonLd]} />
      {children}
    </>
  );
}
