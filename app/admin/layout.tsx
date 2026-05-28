import type { Metadata } from "next";

import AdminClientLayout from "@/app/admin/client-layout";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin Panel",
  description: "QR Menüm yönetici paneli.",
  path: "/admin",
  indexable: false,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
