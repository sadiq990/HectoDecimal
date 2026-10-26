import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Converter } from "@/components/Converter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StepsTable } from "@/components/StepsTable";
import { Faq } from "@/components/Faq";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { STATIC_HEX_VALUES, getHexValueData } from "@/lib/values";
import {
  constructMetadata,
  getWebApplicationSchema,
  getBreadcrumbSchema,
  getFaqSchema,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return STATIC_HEX_VALUES.map((value) => ({
    value,
  }));
}

interface ValuePageProps {
  params: Promise<{ value: string }>;
}

export async function generateMetadata({ params }: ValuePageProps): Promise<Metadata> {
  const { value } = await params;
  const data = getHexValueData(value);
  if (!data) return {};

  const title = `What is ${data.hex} in Decimal? Answer: ${data.dec} | HexDec`;
  const description = `Find out what ${data.hex} hex is in decimal (${data.dec}) with step-by-step positional math, 4-bit binary breakdown (${data.binNibbles}), and ASCII notes.`;

  return constructMetadata({
    title,
    description,
    canonicalPath: `/hex-to-decimal/${data.hex}`,
    keywords: [
      `${data.hex} in decimal`,
      `what is ${data.hex} in decimal`,
      `hex ${data.hex} to decimal`,
      `convert ${data.hex} to decimal`,
      `${data.hex} hex`,
    ],
  });
}

export default async function ValuePage({ params }: ValuePageProps) {
  const { value } = await params;
  const data = getHexValueData(value);

  if (!data) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Hex to Decimal", href: "/hex-to-decimal" },
    { label: `${data.hex} to Decimal` },
  ];

  const valueFaqs = [
    {
      question: `What is hexadecimal ${data.hex} equal to in decimal?`,
      answer: `Hexadecimal ${data.hex} equals exactly ${data.dec} in base 10 decimal. It is calculated by positional notation: ${data.steps.formula}.`,
    },
    {
      question: `What is ${data.hex} in binary?`,
      answer: `In binary, hex ${data.hex} is written as ${data.bin} (grouped as ${data.binNibbles}). Each hex character represents a 4-bit nibble.`,
    },
    {
      question: `How do you calculate ${data.hex} hex to decimal manually?`,
      answer: `Evaluate each digit multiplied by 16 raised to its position from right to left: ${data.steps.formula}.`,
    },
  ];

  const jsonLdData = [
    getWebApplicationSchema(
      `Convert Hex ${data.hex} to Decimal`,
      `Learn how to convert ${data.hex} hex to decimal ${data.dec}`,
      `/hex-to-decimal/${data.hex}`
    ),
    getBreadcrumbSchema(breadcrumbItems),
    getFaqSchema(valueFaqs),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <article className="w-full space-y-10">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Hero Header with exact answer in H1 */}
        <section className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold text-[var(--accent)] mb-2">
            <span>Hexadecimal Breakdown</span>
            <span>•</span>
            <span className="font-mono-numbers">Base 16 → Base 10</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
            What is {data.hex} in decimal?{" "}
            <span className="text-gradient font-mono-numbers">{data.dec}</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Hexadecimal <span className="font-mono font-semibold text-[var(--text)]">{data.hex}</span> is
            equal to <span className="font-mono font-semibold text-[var(--accent)]">{data.dec}</span> in
            base 10 decimal notation, and corresponds to binary{" "}
            <span className="font-mono text-[var(--text)]">{data.binNibbles}</span>.
          </p>
        </section>

        {/* Live Converter Pre-filled with this value */}
        <section aria-label={`Convert ${data.hex} in Live Calculator`}>
          <Converter
            initialFromBase={16}
            initialToBase={10}
            initialValue={data.hex}
            showTabs={false}
          />
        </section>

        {/* Positional Steps Breakdown */}
        <StepsTable steps={data.steps} baseName="hexadecimal" />

        {/* Detailed Representation Insights Card */}
        <section
          aria-labelledby="insights-heading"
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6"
        >
          <h2
            id="insights-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]"
          >
            Mathematical & Contextual Profiles for {data.hex}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Decimal Representation */}
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-1">
                Base 10 Decimal
              </span>
              <span className="font-mono-numbers text-xl font-bold text-[var(--text)]">
                {data.dec}
              </span>
            </div>

            {/* Binary Representation */}
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-1">
                Base 2 Binary
              </span>
              <span className="font-mono-numbers text-sm font-bold text-[var(--text)] break-all">
                {data.binNibbles}
              </span>
            </div>

            {/* ASCII Character if applicable */}
            {data.asciiChar && (
              <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
                <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold block mb-1">
                  ASCII Representation
                </span>
                <span className="font-mono text-sm font-bold text-[var(--accent)]">
                  {data.asciiChar}
                </span>
              </div>
            )}
          </div>

          {/* RGB Color Channel Note if <= 255 */}
          {data.rgbNote && (
            <div className="p-4 rounded-xl bg-[var(--accent-light)] border border-[var(--accent)]/30 text-sm leading-relaxed text-[var(--text)]">
              <span className="font-bold text-[var(--accent)] block mb-1">RGB Channel Context:</span>
              {data.rgbNote}
            </div>
          )}

          {/* Special Architecture Note if applicable */}
          {data.specialNote && (
            <div className="p-4 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-sm leading-relaxed text-[var(--text-muted)]">
              <span className="font-bold text-[var(--text)] block mb-1">System Profile:</span>
              {data.specialNote}
            </div>
          )}
        </section>

        {/* Previous and Next Value Pagination Links */}
        <nav
          aria-label="Previous and Next Hexadecimal Values"
          className="flex items-center justify-between border-t border-[var(--border)] pt-6"
        >
          {data.prevHex ? (
            <Link
              href={`/hex-to-decimal/${data.prevHex}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous: {data.prevHex}</span>
            </Link>
          ) : (
            <div />
          )}

          {data.nextHex ? (
            <Link
              href={`/hex-to-decimal/${data.nextHex}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span>Next: {data.nextHex}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Specific FAQ */}
        <Faq items={valueFaqs} title={`Frequently Asked Questions About ${data.hex}`} />

        {/* Related Converters */}
        <RelatedConverters currentPath={`/hex-to-decimal/${data.hex}`} />
      </article>
    </>
  );
}
