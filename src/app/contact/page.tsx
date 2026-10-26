import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { messages } from "@/messages/en";
import { constructMetadata, getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us – Engineering Feedback & Inquiries | HexDec",
  description:
    "Have questions, feedback, or a feature suggestion for HexDec? Contact our engineering team directly via email.",
  canonicalPath: "/contact",
  keywords: ["contact hexdec", "hex converter support", "feedback"],
});

export default function ContactPage() {
  const breadcrumbItems = [{ label: messages.nav.contact, href: "/contact" }];

  return (
    <>
      <JsonLd data={getBreadcrumbSchema(breadcrumbItems)} />

      <article className="w-full space-y-10 max-w-3xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)]">
            Contact <span className="text-gradient">HexDec</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Have questions, feedback, or bug reports? We love hearing from developers and students.
          </p>
        </header>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
              Direct Email
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              We operate without third-party form backend services to safeguard your email address from web scrapers. Click the link below to open your native mail client:
            </p>
          </div>

          <div className="pt-2">
            <a
              href={`mailto:${siteConfig.links.contactEmail}?subject=HexDec%20Feedback`}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Email: {siteConfig.links.contactEmail}</span>
            </a>
          </div>

          <div className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
            Response times: typically within 24 to 48 business hours.
          </div>
        </div>

        <RelatedConverters currentPath="/contact" />
      </article>
    </>
  );
}
