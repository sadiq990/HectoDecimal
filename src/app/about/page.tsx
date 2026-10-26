import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { messages } from "@/messages/en";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "About HexDec – The Cleanest Number Base Converter",
  description:
    "HexDec is built for engineers and students who demand zero ads, instant keystroke conversion, full BigInt precision, and transparent mathematical steps.",
  canonicalPath: "/about",
  keywords: ["about hexdec", "ad-free hex converter", "fast number base converter"],
});

export default function AboutPage() {
  const breadcrumbItems = [{ label: messages.nav.about, href: "/about" }];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />

      <article className="w-full space-y-10 max-w-3xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
            About <span className="text-gradient">{siteConfig.name}</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            The cleanest, fastest, and most privacy-focused number base converter on the web.
          </p>
        </header>

        <div className="space-y-6 text-base sm:text-lg text-[var(--text)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              Our Core Mission
            </h2>
            <p className="text-[var(--text-muted)]">
              Existing online base converters are cluttered with flashing display ads, slow loading times, tiny input boxes, and arbitrary 16-character or 64-bit limits. Most provide no mathematical explanation of how a conversion was derived.
            </p>
            <p className="text-[var(--text-muted)]">
              We built <strong>HexDec</strong> with a single promise: create the standard that developers, students, and engineers actually enjoy using every single day.
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h3 className="font-bold text-base text-[var(--text)]">Zero Ads, Ever</h3>
              <p className="text-sm text-[var(--text-muted)]">
                No third-party ad networks, no banner animations, and no intrusive popups to slow down your workflow.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h3 className="font-bold text-base text-[var(--text)]">Arbitrary BigInt Precision</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Calculate numbers exceeding 10,000 characters without floating-point truncation or integer overflow bugs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h3 className="font-bold text-base text-[var(--text)]">Complete Transparency</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Every calculation reveals the underlying positional math, digit weights, and partial products.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
              <h3 className="font-bold text-base text-[var(--text)]">100% Client-Side Privacy</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Your data never leaves your device. All calculations run strictly in your browser runtime.
              </p>
            </div>
          </section>
        </div>

        <RelatedConverters currentPath="/about" />
      </article>
    </>
  );
}
