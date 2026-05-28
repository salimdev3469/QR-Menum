import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Providers } from "@/app/providers";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "QR Menüm | QR Menü ve Restoran Yönetim Sistemi",
    template: "%s | QR Menüm",
  },
  description:
    "Restoran ve kafeler için QR menü, dijital menü yönetimi, promosyon ve operasyon odaklı restoran yönetim sistemi.",
  keywords: [
    "qr menü",
    "restoran yönetim sistemi",
    "dijital menü",
    "adisyon yazılımı",
    "garson çağrı sistemi",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "QR Menüm",
    url: "/",
    title: "QR Menüm | QR Menü ve Restoran Yönetim Sistemi",
    description:
      "Restoran ve kafeler için QR menü, dijital menü yönetimi, promosyon ve operasyon odaklı restoran yönetim sistemi.",
    images: [
      {
        url: "/customer-qr-showcase.jpg",
        width: 1200,
        height: 630,
        alt: "QR Menüm restoran yönetim sistemi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Menüm | QR Menü ve Restoran Yönetim Sistemi",
    description:
      "Restoran ve kafeler için QR menü, dijital menü yönetimi, promosyon ve operasyon odaklı restoran yönetim sistemi.",
    images: ["/customer-qr-showcase.jpg"],
  },
  verification: {
    google: "IpqraQCaDXpbNJzAJx0vO394CM1IDKVYR8x8tQGefi0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${manrope.variable} bg-slate-100 text-slate-900 antialiased`}>
        <Providers initialLocale="tr" initialMarket="tr">
          {children}
        </Providers>
      </body>
    </html>
  );
}
