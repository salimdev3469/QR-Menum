"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { t } from "@/lib/i18n";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loading, firebaseUser } = useAuth();
  const { locale } = useLocale();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/login");
    }
  }, [firebaseUser, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow">
          <Spinner /> {t("checkingSession", locale)}
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
