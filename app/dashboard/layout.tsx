import type { Metadata } from "next";

import DashboardClientLayout from "@/app/dashboard/client-layout";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard",
  description: "QR Menüm yönetim paneli.",
  path: "/dashboard",
  indexable: false,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
