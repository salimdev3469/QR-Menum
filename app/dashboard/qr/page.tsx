"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { buildPublicMenuUrl } from "@/lib/url";
import { downloadDataUrl, generateQrDataUrl } from "@/services/qr-service";

export default function QrPage() {
  const { restaurant } = useAuth();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const menuUrl = useMemo(() => {
    if (!restaurant?.slug) {
      return "";
    }

    try {
      return buildPublicMenuUrl(restaurant.slug);
    } catch {
      return "";
    }
  }, [restaurant?.slug]);

  useEffect(() => {
    if (!menuUrl) {
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const qr = await generateQrDataUrl(menuUrl);
        setQrDataUrl(qr);
      } catch {
        setError("QR kod üretilemedi.");
      } finally {
        setLoading(false);
      }
    })();
  }, [menuUrl]);

  const handleDownload = () => {
    if (!qrDataUrl || !restaurant?.slug) {
      return;
    }

    downloadDataUrl(`${restaurant.slug}-qr-menu.png`, qrDataUrl);
  };

  const handleCopyLink = async () => {
    if (!menuUrl) {
      return;
    }

    await navigator.clipboard.writeText(menuUrl);
  };

  return (
    <Card>
      <h1 className="text-xl font-bold text-slate-900">QR Kod Oluşturma</h1>
      <p className="mt-1 text-sm text-slate-600">
        QR kod müşteriyi public menü sayfanıza yönlendirir.
      </p>
      <div className="mt-3">
        <Link
          href="/stands"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          QR Stant Satın Al
        </Link>
      </div>

      {error ? <Alert variant="error">{error}</Alert> : null}

      {loading ? (
        <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
          <Spinner /> QR kod hazırlanıyor...
        </div>
      ) : qrDataUrl ? (
        <div className="mt-4 space-y-4">
          <div className="flex justify-center rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <img src={qrDataUrl} alt="QR Menüm" className="h-64 w-64" />
          </div>

          <p className="break-all rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{menuUrl}</p>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleDownload}>
              PNG Olarak İndir
            </Button>
            <Button type="button" variant="secondary" onClick={handleCopyLink}>
              Linki Kopyala
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          QR kod için geçerli bir slug bulunamadı. Önce işletme profilini tamamlayın.
        </p>
      )}
    </Card>
  );
}
