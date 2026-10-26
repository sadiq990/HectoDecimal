import type { Metadata } from "next";
import { Converter } from "@/components/Converter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { ReferenceTable } from "@/components/ReferenceTable";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { TOOL_PAGES } from "@/lib/content";
import {
  constructMetadata,
  getWebApplicationSchema,
  getFaqSchema,
  getBreadcrumbSchema,
} from "@/lib/seo";

const pageContent = TOOL_PAGES["hex-to-binary"]!;

export const metadata: Metadata = constructMetadata({
  title: pageContent.metaTitle,
  description: pageContent.metaDescription,
  canonicalPath: pageContent.slug,
  keywords: [
    "hex to binary",
    "hex to binary converter",
    "hex to bin",
    "convert hex to binary",
    "base 16 to base 2",
  ],
});

export default function HexToBinaryPage() {
  const breadcrumbItems = [{ label: pageContent.h1, href: pageContent.slug }];

  const jsonLdData = [
    getWebApplicationSchema(
      pageContent.h1,
      pageContent.metaDescription,
      pageContent.slug
    ),
    getBreadcrumbSchema(breadcrumbItems),
    getFaqSchema(pageContent.faqs),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <article className="w-full space-y-10">
        <Breadcrumbs items={breadcrumbItems} />

        <section className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
            Hex to <span className="text-gradient">Binary</span> Converter
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            {pageContent.intro[0]} {pageContent.intro[1]}
          </p>
        </section>

        <section aria-label="Hex to Binary Converter">
          <Converter
            initialFromBase={16}
            initialToBase={2}
            initialValue="2F"
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

        <ReferenceTable
          title={pageContent.referenceTable.title}
          caption={pageContent.referenceTable.caption}
          headers={pageContent.referenceTable.headers}
          rows={pageContent.referenceTable.rows}
        />

        <Faq items={pageContent.faqs} />

        <RelatedConverters currentPath={pageContent.slug} />
      </article>
    </>
  );
}
