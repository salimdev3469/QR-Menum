import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Providers } from "@/app/providers";
import { resolveRequestLocale } from "@/lib/request-locale";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Menüm",
  description: "Restoran ve kafeler için QR menü yönetim uygulaması",
  verification: {
    google: "IpqraQCaDXpbNJzAJx0vO394CM1IDKVYR8x8tQGefi0",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await resolveRequestLocale();

  return (
    <html lang={initialLocale}>
      <body className={`${manrope.variable} bg-slate-100 text-slate-900 antialiased`}>
        <Providers initialLocale={initialLocale}>{children}</Providers>
      </body>
    </html>
  );
}
