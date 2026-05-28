import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Kayıt Ol",
  description: "QR Menüm hesabı oluşturun ve panelinizi açın.",
  path: "/register",
  indexable: false,
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
