const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
// Normalize URL to never have a trailing slash
const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteConfig = {
  name: "HexDec",
  tagline: "The fastest, cleanest hex & number base converter",
  description:
    "Instant, step-by-step hexadecimal to decimal converter. Free, client-side, zero ads, unlimited BigInt precision, and complete mathematical breakdown.",
  url: siteUrl,
  locales: ["en"] as const,
  defaultLocale: "en" as const,
  twitterHandle: "@hexdec",
  author: {
    name: "HexDec Team",
    url: siteUrl,
  },
  links: {
    github: "https://github.com",
    contactEmail: "support@hexdec.example.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") {
    return siteConfig.url;
  }
  return `${siteConfig.url}${normalizedPath}`;
}
