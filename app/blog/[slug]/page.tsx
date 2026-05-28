import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog";
import { buildBreadcrumbJsonLd, buildJsonLd, buildPageMetadata, toAbsoluteUrl } from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: "İçerik Bulunamadı",
      description: "Talep edilen blog içeriği bulunamadı.",
      path: `/blog/${slug}`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Ana Sayfa", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const articleJsonLd = buildJsonLd("BlogPosting", {
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "tr-TR",
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    mainEntityOfPage: toAbsoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Organization",
      name: "QR Menüm",
    },
    publisher: {
      "@type": "Organization",
      name: "QR Menüm",
    },
  });

  return (
    <MarketingPageShell locale="tr">
      <JsonLd data={[breadcrumbJsonLd, articleJsonLd]} />

      <article className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{post.category}</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
          <span>{new Date(post.publishedAt).toLocaleDateString("tr-TR")}</span>
          <span>•</span>
          <span>{post.readingTimeMinutes} dk okuma</span>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">{post.description}</p>

        <div className="mt-8 space-y-7">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{section.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-900">Bu içeriği kendi işletmende uygulamak için sonraki adım:</p>
          <Link
            href={post.ctaHref}
            className="mt-3 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            {post.ctaLabel}
          </Link>
        </div>
      </article>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white/90 p-6">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Diğer Rehberler</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {BLOG_POSTS.filter((item) => item.slug !== post.slug)
            .slice(0, 4)
            .map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                {item.title}
              </Link>
            ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
