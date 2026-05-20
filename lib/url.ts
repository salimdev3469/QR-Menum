export function buildPublicMenuUrl(slug: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL eksik. QR linki üretilemiyor.");
  }

  return `${appUrl.replace(/\/$/, "")}/menu/${slug}`;
}
