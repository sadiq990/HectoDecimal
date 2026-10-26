import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "@/config/site";
import type { FaqItem } from "@/components/Faq";
import type { BreadcrumbItem } from "@/components/Breadcrumbs";

export interface PageSeoProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  ogImage?: string;
}

/**
 * Builds Next.js Metadata object adhering strictly to SEO standards.
 */
export function constructMetadata({
  title,
  description,
  canonicalPath,
  ogType = "website",
  publishedTime,
  modifiedTime,
  keywords,
  ogImage,
}: PageSeoProps): Metadata {
  const url = absoluteUrl(canonicalPath);
  const defaultOgImage = ogImage || absoluteUrl(`/api/og?title=${encodeURIComponent(title)}`);

  return {
    title,
    description,
    keywords: keywords ?? [
      "hex to decimal",
      "hex to decimal converter",
      "hexadecimal to decimal",
      "convert hex to decimal",
      "base 16 to base 10",
      "number base converter",
    ],
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    creator: siteConfig.author.name,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.defaultLocale,
      type: ogType,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.twitterHandle,
      images: [defaultOgImage],
    },
  };
}

/**
 * JSON-LD schema for WebSite
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

/**
 * JSON-LD schema for Organization
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
  };
}

/**
 * JSON-LD schema for WebApplication
 */
export function getWebApplicationSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/**
 * JSON-LD schema for FAQPage
 */
export function getFaqSchema(faqItems: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * JSON-LD schema for BreadcrumbList
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.url,
    },
  ];

  items.forEach((item, index) => {
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : siteConfig.url,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * JSON-LD schema for Article
 */
export function getArticleSchema({
  title,
  description,
  url,
  datePublished = "2025-01-01T00:00:00Z",
  dateModified = "2025-01-01T00:00:00Z",
}: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(url),
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(url),
    },
  };
}
