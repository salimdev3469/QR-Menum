import type { Metadata } from "next";
import Link from "next/link";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionDivider } from "@/components/marketing/section-divider";
import { BLOG_POSTS, EDITORIAL_PIPELINE } from "@/lib/blog";
import { buildBreadcrumbJsonLd, buildJsonLd, buildPageMetadata, toAbsoluteUrl } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "QR Menü ve Restoran Yönetimi Blogu",
  description:
    "QR menü, restoran yönetim sistemi, adisyon süreçleri ve operasyon geliştirme için uygulamalı rehber içerikler.",
  path: "/blog",
  keywords: ["qr menü blog", "restoran yönetim rehberi", "adisyon yazılımı içerikleri"],
});

export default function BlogPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  const blogJsonLd = buildJsonLd("Blog", {
    name: "QR Menüm Blog",
    description:
      "QR menü, restoran yönetimi ve adisyon süreçlerine yönelik güncel rehber içerikler.",
    url: toAbsoluteUrl("/blog"),
    blogPost: BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      url: toAbsoluteUrl(`/blog/${post.slug}`),
    })),
  });

  return (
    <MarketingPageShell locale="tr">
      <JsonLd data={[breadcrumbJsonLd, blogJsonLd]} />

      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Blog</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          QR menü ve restoran yönetiminde daha hızlı büyümek için pratik rehberler.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">
          İçerikler operasyon çıktısına odaklıdır: servis hızı, masa dönüşü, kampanya verimliliği ve satış
          kararını hızlandıran uygulamalar.
        </p>
      </section>

      <SectionDivider label="Yayınlanan İçerikler" />

      <section className="grid gap-4 md:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">{post.category}</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{post.description}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
              <span>•</span>
              <span>{post.readingTimeMinutes} dk okuma</span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              İçeriği Oku
            </Link>
          </article>
        ))}
      </section>

      <SectionDivider label="6 Aylık İçerik Takvimi" />

      <section className="grid gap-4 md:grid-cols-2">
        {EDITORIAL_PIPELINE.map((item) => (
          <article key={item.month} className="rounded-2xl border border-slate-200 bg-white/90 p-5">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{item.month}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {item.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </MarketingPageShell>
  );
}
