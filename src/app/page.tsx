import type { Metadata } from "next";
import { Converter } from "@/components/Converter";
import { Faq } from "@/components/Faq";
import { ReferenceTable } from "@/components/ReferenceTable";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { TOOL_PAGES } from "@/lib/content";
import {
  constructMetadata,
  getWebSiteSchema,
  getOrganizationSchema,
  getWebApplicationSchema,
  getFaqSchema,
} from "@/lib/seo";

const pageContent = TOOL_PAGES["hex-to-decimal"]!;

export const metadata: Metadata = constructMetadata({
  title: pageContent.metaTitle,
  description: pageContent.metaDescription,
  canonicalPath: "/hex-to-decimal", // Canonical points to the dedicated tool URL
  keywords: [
    "hex to decimal",
    "hex to decimal converter",
    "hexadecimal to decimal",
    "convert hex to decimal",
    "base 16 to base 10",
  ],
});

export default function HomePage() {
  const jsonLdData = [
    getWebSiteSchema(),
    getOrganizationSchema(),
    getWebApplicationSchema(
      pageContent.h1,
      pageContent.metaDescription,
      pageContent.slug
    ),
    getFaqSchema(pageContent.faqs),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <article className="w-full space-y-10">
        {/* Above-the-fold Hero Section */}
        <section className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto pt-2 sm:pt-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text)]">
            Hex to <span className="text-gradient">Decimal</span> Converter
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            {pageContent.intro[0]} {pageContent.intro[1]}
          </p>
        </section>

        {/* Live Interactive Converter */}
        <section aria-label="Interactive Number Base Converter" className="pt-2">
          <Converter
            initialFromBase={16}
            initialToBase={10}
            initialValue="7DE"
            showTabs={true}
          />
        </section>

        {/* Worked Example */}
        <section
          aria-labelledby="worked-example-heading"
          className="mt-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
        >
          <div className="space-y-3">
            <h2
              id="worked-example-heading"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]"
            >
              {pageContent.workedExample.heading}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              {pageContent.workedExample.description}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-[var(--text)] font-mono-numbers pt-2">
              {pageContent.workedExample.stepsList.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="font-sans text-[var(--text-muted)]">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] font-semibold text-sm sm:text-base text-[var(--accent)]">
              {pageContent.workedExample.summary}
            </div>
          </div>
        </section>

        {/* Quick Reference Table */}
        <ReferenceTable
          title={pageContent.referenceTable.title}
          caption={pageContent.referenceTable.caption}
          headers={pageContent.referenceTable.headers}
          rows={pageContent.referenceTable.rows}
        />

        {/* Frequently Asked Questions */}
        <Faq items={pageContent.faqs} />

        {/* Related Converters Internal Links */}
        <RelatedConverters currentPath="/hex-to-decimal" />
      </article>
    </>
  );
}
