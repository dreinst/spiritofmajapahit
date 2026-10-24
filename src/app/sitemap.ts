import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.SITE_URL || "https://majapahit.dpro.events";
  return ["", "/acara", "/daftar", "/cek-tiket"].map((p) => ({ url: `${site}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}
