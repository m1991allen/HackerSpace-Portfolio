import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 後台與 API 不需要被索引
      disallow: ["/admin", "/api"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
