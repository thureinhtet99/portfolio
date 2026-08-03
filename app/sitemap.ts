import { db } from "@/db/client";
import { post, project } from "@/db/schema";
import { asc } from "drizzle-orm";
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://thureinhtet.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/timeline`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/leave-a-note`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/labs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const projects = await db
      .select()
      .from(project)
      .orderBy(asc(project.order))
      .all();

    dynamicRoutes = [
      ...dynamicRoutes,
      ...projects.map((p) => ({
        url: `${BASE_URL}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // fallback to static only
  }

  try {
    const posts = await db.select().from(post).orderBy(asc(post.order)).all();

    dynamicRoutes = [
      ...dynamicRoutes,
      ...posts.map((p) => ({
        url: `${BASE_URL}/posts/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // fallback to static only
  }

  return [...staticRoutes, ...dynamicRoutes];
}
