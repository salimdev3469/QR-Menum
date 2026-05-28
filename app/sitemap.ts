import type { MetadataRoute } from "next";

import { BLOG_POSTS } from "@/lib/blog";
import { LANDING_PAGES } from "@/lib/seo-landings";
import { getSiteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "",
  "/features",
  "/pricing",
  "/purchase",
  "/stands",
  "/about",
  "/contact",
  "/faq",
  "/blog",
  "/privacy",
  "/terms",
  "/cookies",
  "/kvkk",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const landingEntries: MetadataRoute.Sitemap = LANDING_PAGES.map((item) => ({
    url: `${baseUrl}/${item.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...landingEntries, ...blogEntries];
}
