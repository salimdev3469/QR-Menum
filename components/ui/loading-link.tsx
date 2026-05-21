"use client";

import Link, { type LinkProps } from "next/link";
import { type AnchorHTMLAttributes, type MouseEventHandler, useState } from "react";

import { BrandLoadingIndicator } from "@/components/ui/brand-loading-indicator";
import { NAVIGATION_LOADING_EVENT } from "@/components/ui/navigation-loading-hud";
import { cn } from "@/lib/utils";

type LoadingLinkProps = Omit<LinkProps, "onClick" | "onNavigate"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
    loadingText?: string;
    loadingClassName?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  };

export function LoadingLink({
  className,
  children,
  loadingText = "Yukleniyor...",
  loadingClassName,
  onClick,
  ...props
}: LoadingLinkProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <Link
      {...props}
      onClick={(event) => {
        if (isPending) {
          event.preventDefault();
          return;
        }

        onClick?.(event);

        if (!event.defaultPrevented) {
          window.dispatchEvent(new Event(NAVIGATION_LOADING_EVENT));
        }
      }}
      onNavigate={(event) => {
        if (isPending) {
          event.preventDefault();
          return;
        }

        window.dispatchEvent(new Event(NAVIGATION_LOADING_EVENT));
        setIsPending(true);
      }}
      className={cn(
        className,
        isPending && "pointer-events-none cursor-not-allowed opacity-70",
        isPending && loadingClassName,
      )}
      aria-disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? (
        <span className="inline-flex items-center gap-2">
          <BrandLoadingIndicator />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </Link>
  );
}
