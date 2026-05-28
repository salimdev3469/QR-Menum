import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Giriş Yap",
  description: "QR Menüm paneline giriş yapın.",
  path: "/login",
  indexable: false,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
