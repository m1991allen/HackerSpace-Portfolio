import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getAllProjects } from "@/lib/projects";

/**
 * 網站地圖。固定頁面加上所有作品內頁。
 * 後台（/admin）與 API 不列入，見 robots.ts。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/work`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const projects = await getAllProjects();
  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${site.url}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
