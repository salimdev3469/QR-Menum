import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandLogoLinkProps {
  href?: string;
  className?: string;
  labelClassName?: string;
}

export function BrandLogoLink({ href = "/", className, labelClassName }: BrandLogoLinkProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} aria-label="Anasayfaya dön">
      <div className="h-8 w-8 rounded-lg bg-emerald-600 p-1.5">
        <div className="grid h-full w-full grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className={cn("rounded-[1px]", index % 2 === 0 ? "bg-white" : "bg-white/45")} />
          ))}
        </div>
      </div>
      <span className={cn("text-base font-extrabold tracking-tight text-slate-900", labelClassName)}>QR Menüm</span>
    </Link>
  );
}
