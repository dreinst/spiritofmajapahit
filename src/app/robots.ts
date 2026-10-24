import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL || "https://majapahit.dpro.events";
  if (process.env.SITE_NOINDEX === "1") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/mjpadmin", "/api/", "/bayar/", "/tiket/"] }, sitemap: `${site}/sitemap.xml` };
}
