import type { Metadata } from "next";

import type { MarketingLocale } from "@/lib/request-locale";

export interface SeoPageConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  indexable?: boolean;
  locale?: MarketingLocale;
  type?: "website" | "article";
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!envUrl) {
    return "https://qrmenum.app";
  }

  return envUrl.replace(/\/$/, "");
}

export function toAbsoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

function buildRobots(indexable: boolean): Metadata["robots"] {
  if (!indexable) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return {
    index: true,
    follow: true,
  };
}

export function buildPageMetadata(config: SeoPageConfig): Metadata {
  const {
    title,
    description,
    path,
    keywords,
    ogImage = "/customer-qr-showcase.jpg",
    indexable = true,
    locale = "tr",
    type = "website",
  } = config;

  const url = toAbsoluteUrl(path);
  const imageUrl = ogImage.startsWith("http") ? ogImage : toAbsoluteUrl(ogImage);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    robots: buildRobots(indexable),
    openGraph: {
      title,
      description,
      url,
      siteName: "QR Menüm",
      type,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - QR Menüm`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildJsonLd<T extends Record<string, unknown>>(
  type: string,
  payload: T,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": type,
    ...payload,
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return buildJsonLd("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  });
}
