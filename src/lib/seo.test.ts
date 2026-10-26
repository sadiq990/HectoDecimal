import { describe, it, expect } from "vitest";
import { TOOL_PAGES } from "./content";
import { STATIC_HEX_VALUES, getHexValueData } from "./values";
import {
  getWebSiteSchema,
  getOrganizationSchema,
  getWebApplicationSchema,
  getFaqSchema,
  getBreadcrumbSchema,
  getArticleSchema,
} from "./seo";

describe("SEO and JSON-LD Validations", () => {
  it("ensures all tool pages have unique titles, descriptions, and canonical paths", () => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    const slugs = new Set<string>();

    for (const [, page] of Object.entries(TOOL_PAGES)) {
      expect(page.h1).toBeTruthy();
      expect(page.metaTitle).toBeTruthy();
      expect(page.metaDescription).toBeTruthy();
      expect(page.slug).toBeTruthy();

      // Check uniqueness
      expect(titles.has(page.metaTitle)).toBe(false);
      expect(descriptions.has(page.metaDescription)).toBe(false);
      expect(slugs.has(page.slug)).toBe(false);

      titles.add(page.metaTitle);
      descriptions.add(page.metaDescription);
      slugs.add(page.slug);

      // Verify at least 5 FAQs per tool page
      expect(page.faqs.length).toBeGreaterThanOrEqual(5);

      // Verify JSON-LD schemas parse without error
      const webAppSchema = getWebApplicationSchema(page.h1, page.metaDescription, page.slug);
      const parsedWebApp = JSON.parse(JSON.stringify(webAppSchema));
      expect(parsedWebApp["@type"]).toBe("WebApplication");
      expect(parsedWebApp["offers"]["price"]).toBe("0");

      const faqSchema = getFaqSchema(page.faqs);
      const parsedFaq = JSON.parse(JSON.stringify(faqSchema));
      expect(parsedFaq["@type"]).toBe("FAQPage");
      expect(parsedFaq.mainEntity.length).toBe(page.faqs.length);
    }
  });

  it("validates WebSite and Organization schema shapes", () => {
    const siteSchema = getWebSiteSchema();
    const parsedSite = JSON.parse(JSON.stringify(siteSchema));
    expect(parsedSite["@type"]).toBe("WebSite");
    expect(parsedSite.name).toBeTruthy();
    expect(parsedSite.url).toBeTruthy();

    const orgSchema = getOrganizationSchema();
    const parsedOrg = JSON.parse(JSON.stringify(orgSchema));
    expect(parsedOrg["@type"]).toBe("Organization");
    expect(parsedOrg.logo).toBeTruthy();
  });

  it("validates Breadcrumb and Article schemas", () => {
    const breadcrumbSchema = getBreadcrumbSchema([
      { label: "Converters", href: "/hex-to-decimal" },
      { label: "FF to Decimal" },
    ]);
    const parsedBreadcrumbs = JSON.parse(JSON.stringify(breadcrumbSchema));
    expect(parsedBreadcrumbs["@type"]).toBe("BreadcrumbList");
    expect(parsedBreadcrumbs.itemListElement.length).toBe(3);

    const articleSchema = getArticleSchema({
      title: "How to Convert Hex to Decimal",
      description: "Complete Guide",
      url: "/how-to-convert-hex-to-decimal",
    });
    const parsedArticle = JSON.parse(JSON.stringify(articleSchema));
    expect(parsedArticle["@type"]).toBe("Article");
    expect(parsedArticle.headline).toBe("How to Convert Hex to Decimal");
  });

  it("verifies programmatic value pages data integrity", () => {
    expect(STATIC_HEX_VALUES.length).toBe(264);

    // Test a sample of programmatic values
    const sampleValues = ["0", "A", "FF", "100", "7DE", "FFFF", "7FFFFFFF", "FFFFFFFF"];
    for (const val of sampleValues) {
      const data = getHexValueData(val);
      expect(data).not.toBeNull();
      if (data) {
        expect(data.hex).toBe(val.toUpperCase());
        expect(data.dec).toBeTruthy();
        expect(data.bin).toBeTruthy();
        expect(data.steps.rows.length).toBeGreaterThan(0);

        // Test JSON-LD parsing for this value
        const webAppSchema = getWebApplicationSchema(
          `Convert ${data.hex}`,
          `Convert ${data.hex} to decimal ${data.dec}`,
          `/hex-to-decimal/${data.hex}`
        );
        const parsed = JSON.parse(JSON.stringify(webAppSchema));
        expect(parsed["@type"]).toBe("WebApplication");
      }
    }
  });
});
