import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { STATIC_HEX_VALUES } from "@/lib/values";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/hex-to-decimal"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/decimal-to-hex"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/binary-to-decimal"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/decimal-to-binary"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/hex-to-binary"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/binary-to-hex"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/hex-to-decimal-chart"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/how-to-convert-hex-to-decimal"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Programmatic Hex to Decimal value pages (264 values)
  const valueRoutes: MetadataRoute.Sitemap = STATIC_HEX_VALUES.map((hexVal) => ({
    url: absoluteUrl(`/hex-to-decimal/${hexVal}`),
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...valueRoutes];
}
