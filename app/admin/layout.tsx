"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/i18n";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, firebaseUser, userProfile } = useAuth();
  const { locale } = useLocale();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!firebaseUser) {
      router.replace("/login");
      return;
    }

    if (userProfile?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [firebaseUser, loading, router, userProfile?.role]);

  if (loading || !firebaseUser || userProfile?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow">
          <Spinner /> {t("loadingAdminPanel", locale)}
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
