import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { messages } from "@/messages/en";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Privacy Policy – 100% Browser Execution | HexDec",
  description:
    "HexDec is engineered with a strict privacy-first architecture. All number calculations happen entirely in your browser; zero input data is sent to any server.",
  canonicalPath: "/privacy",
  keywords: ["privacy policy", "hexdec privacy", "private number converter"],
});

export default function PrivacyPage() {
  const breadcrumbItems = [{ label: messages.nav.privacy, href: "/privacy" }];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />

      <article className="w-full space-y-10 max-w-3xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            HexDec is engineered around a simple premise: your numbers, cryptographic keys, and code snippets belong exclusively to you.
          </p>
        </header>

        <div className="space-y-6 text-base sm:text-lg text-[var(--text)] leading-relaxed">
          <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--success)] bg-[var(--surface-raised)] border border-[var(--border)] px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <span>Core Privacy Guarantee</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              All Conversion Happens Locally in Your Web Browser
            </h2>
            <p className="text-[var(--text-muted)]">
              When you paste or type numbers into HexDec, <strong>nothing is transmitted to any server</strong>. Every conversion algorithm, input normalization step, and mathematical breakdown runs strictly inside your local JavaScript engine. If you disconnect your internet connection right now, the converter will continue functioning flawlessly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              1. Information We Do Not Collect
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-[var(--text-muted)] pl-2">
              <li>We do <strong>not</strong> log, store, or transmit any inputs or conversion results.</li>
              <li>We do <strong>not</strong> track personal identity, IP addresses, or location data.</li>
              <li>We do <strong>not</strong> use advertising cookies, marketing pixels, or finger-printing scripts.</li>
              <li>We do <strong>not</strong> sell or share any user metrics with third parties.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              2. Local Storage
            </h2>
            <p className="text-[var(--text-muted)]">
              The only information saved on your device is your local visual theme preference (<code className="font-mono text-sm px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">light</code> or <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">dark</code>) stored in your browser&apos;s standard <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">localStorage</code>. This ensures your color scheme persists across visits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              3. Questions & Contact
            </h2>
            <p className="text-[var(--text-muted)]">
              If you have any questions regarding our architectural privacy guarantees, reach out to us at <a href={`mailto:${siteConfig.links.contactEmail}`} className="text-[var(--accent)] underline font-medium">{siteConfig.links.contactEmail}</a>.
            </p>
          </section>
        </div>

        <RelatedConverters currentPath="/privacy" />
      </article>
    </>
  );
}
