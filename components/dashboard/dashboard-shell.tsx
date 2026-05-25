"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/hooks/use-locale";
import { logout } from "@/services/auth-service";

const navItems = [
  { href: "/dashboard", key: "dashboard" as const },
  { href: "/dashboard/waiter-calls", key: "waiterCalls" as const },
  { href: "/dashboard/restaurant", key: "restaurant" as const },
  { href: "/dashboard/categories", key: "categories" as const },
  { href: "/dashboard/menu", key: "menuItems" as const },
  { href: "/dashboard/promotions", key: "promotions" as const },
  { href: "/dashboard/qr", key: "qrCode" as const },
  { href: "/dashboard/settings", key: "settings" as const },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const { restaurant } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">QR Menüm</p>
            <p className="text-base font-semibold text-slate-900">{restaurant?.name ?? t("restaurant", locale)}</p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {t("logout", locale)}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-3 py-2 text-sm font-medium",
                    active ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  {t(item.key, locale)}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}
