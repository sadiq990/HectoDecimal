import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { RelatedConverters } from "@/components/RelatedConverters";
import { JsonLd } from "@/components/JsonLd";
import { messages } from "@/messages/en";
import { constructMetadata, getArticleSchema, getBreadcrumbSchema, getFaqSchema } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "How to Convert Hex to Decimal – Complete Math Guide | HexDec",
  description:
    "Master hexadecimal to decimal conversion. Learn positional notation powers of 16, worked step-by-step examples, common pitfalls, and real-world system applications.",
  canonicalPath: "/how-to-convert-hex-to-decimal",
  ogType: "article",
  keywords: [
    "how to convert hex to decimal",
    "convert hex to decimal manual formula",
    "hexadecimal math guide",
    "hex to decimal steps",
    "powers of 16 table",
    "hexadecimal color codes",
  ],
});

export default function GuidePage() {
  const breadcrumbItems = [
    { label: messages.nav.guide, href: "/how-to-convert-hex-to-decimal" },
  ];

  const guideFaqs = [
    {
      question: "What is the simplest formula to convert hex to decimal?",
      answer:
        "The formula is: Decimal Value = (dₙ × 16ⁿ) + ... + (d₁ × 16¹) + (d₀ × 16⁰), where each d is the decimal value of the hex digit (0–9, or 10–15 for A–F) and the exponent corresponds to its 0-indexed position from right to left.",
    },
    {
      question: "Why does hexadecimal use 16 as its base?",
      answer:
        "16 is an exact power of 2 (2⁴ = 16). This means four binary bits (a nibble) correspond exactly to one hexadecimal character, making machine code and byte memory addresses clean and compact for human engineers.",
    },
    {
      question: "Are hexadecimal letters case-sensitive?",
      answer:
        "No. Hexadecimal notation is universally case-insensitive: 'A' and 'a' both represent the numerical value 10, 'B' and 'b' represent 11, and so on up to 'F' and 'f' representing 15.",
    },
    {
      question: "How do I convert a fractional hex number (e.g., 0.8)?",
      answer:
        "Digits to the right of the radix point use negative powers of 16: 0.8 in hex equals 8 × 16⁻¹ = 8/16 = 0.5 in decimal.",
    },
    {
      question: "What is the fastest way to check my manual math?",
      answer:
        "Use our live converter on the homepage or tool pages, which instantly breaks down every positional product and running subtotal in real time.",
    },
  ];

  const jsonLdData = [
    getArticleSchema({
      title: "How to Convert Hexadecimal to Decimal: The Complete Mathematical Guide",
      description:
        "Comprehensive tutorial exploring positional powers of 16, manual algorithms, common student mistakes, and computer science applications.",
      url: "/how-to-convert-hex-to-decimal",
    }),
    getBreadcrumbSchema(breadcrumbItems),
    getFaqSchema(guideFaqs),
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />

      <article className="w-full space-y-10 max-w-4xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Header */}
        <header className="space-y-4 border-b border-[var(--border)] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-xs font-semibold text-[var(--accent)]">
            <span>Engineering Guide</span>
            <span>•</span>
            <span>12-Minute Read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text)] leading-tight">
            How to Convert <span className="text-gradient">Hexadecimal to Decimal</span>: The Complete Guide
          </h1>

          <p className="text-base sm:text-xl text-[var(--text-muted)] leading-relaxed">
            A comprehensive, rigorous walkthrough of base 16 positional mathematics, manual calculation techniques, common student mistakes, and real-world software engineering applications.
          </p>
        </header>

        {/* Main Content Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-[var(--text)] text-base sm:text-lg leading-relaxed">
          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              1. Understanding Number Bases and the Hexadecimal System
            </h2>
            <p>
              In our daily lives, we rely almost exclusively on the <strong>decimal system (base 10)</strong>, which uses ten unique symbols: <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">0, 1, 2, 3, 4, 5, 6, 7, 8, 9</code>. In base 10, when we count past 9, we add a new positional column to the left, representing ten units (<span className="font-mono">10¹</span>), then one hundred units (<span className="font-mono">10²</span>), and so forth.
            </p>
            <p>
              The <strong>hexadecimal system (base 16)</strong> operates on precisely the same positional principles, but instead of grouping by powers of ten, it groups by <strong>powers of sixteen</strong>. Because base 16 requires sixteen distinct single-character symbols, computer scientists extended Arabic numerals with the first six letters of the Latin alphabet:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm my-4">
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">A</span> = 10
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">B</span> = 11
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">C</span> = 12
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">D</span> = 13
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">E</span> = 14
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">F</span> = 15
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">10</span> = 16
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-center">
                <span className="font-bold text-[var(--accent)]">FF</span> = 255
              </div>
            </div>
            <p>
              Notice that the number <code className="font-mono text-sm px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)]">10</code> in hexadecimal does <em>not</em> represent ten—it represents sixteen! This foundational distinction is crucial when performing manual conversions.
            </p>
          </section>

          {/* Section 2: Positional Notation Formula */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              2. The Positional Notation Formula
            </h2>
            <p>
              Any integer in positional notation is expressed as the sum of its digits multiplied by the base raised to the power of their index (starting at 0 for the rightmost digit).
            </p>
            <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] font-mono text-sm sm:text-base overflow-x-auto text-center font-medium my-4">
              Decimal Value = (dₙ × 16ⁿ) + (dₙ₋₁ × 16ⁿ⁻¹) + ... + (d₁ × 16¹) + (d₀ × 16⁰)
            </div>
            <p>
              To execute this formula successfully, keep these initial powers of 16 committed to memory or reference our reference table:
            </p>
            <ul className="list-disc list-inside space-y-1 font-mono text-sm text-[var(--text-muted)] pl-2">
              <li>16⁰ = 1</li>
              <li>16¹ = 16</li>
              <li>16² = 256</li>
              <li>16³ = 4,096</li>
              <li>16⁴ = 65,536</li>
              <li>16⁵ = 1,048,576</li>
            </ul>
          </section>

          {/* Section 3: Step-by-Step Worked Examples */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              3. Step-by-Step Worked Examples
            </h2>

            {/* Example 1 */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h3 className="text-lg font-bold text-[var(--accent)]">
                Example A: Converting 3B to Decimal
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-muted)]">
                The number <span className="font-mono font-bold text-[var(--text)]">3B</span> has two digits: position 1 is 3, and position 0 is B.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base font-mono-numbers pl-2">
                <li>Convert letters to values: 3 remains 3; letter B equals 11.</li>
                <li>Position 1: 3 × 16¹ = 3 × 16 = 48.</li>
                <li>Position 0: 11 × 16⁰ = 11 × 1 = 11.</li>
                <li>Add the products: 48 + 11 = 59.</li>
              </ol>
              <p className="text-sm font-semibold text-[var(--success)]">
                Result: 3B in hexadecimal equals 59 in decimal.
              </p>
            </div>

            {/* Example 2 */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h3 className="text-lg font-bold text-[var(--accent)]">
                Example B: Converting 7DE to Decimal (3 Digits)
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-muted)]">
                Let us convert the benchmark value <span className="font-mono font-bold text-[var(--text)]">7DE</span>:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base font-mono-numbers pl-2">
                <li>Identify digit values: 7 is 7, D is 13, E is 14.</li>
                <li>Position 2 (weight 16² = 256): 7 × 256 = 1,792.</li>
                <li>Position 1 (weight 16¹ = 16): 13 × 16 = 208.</li>
                <li>Position 0 (weight 16⁰ = 1): 14 × 1 = 14.</li>
                <li>Sum all values: 1,792 + 208 + 14 = 2,014.</li>
              </ol>
              <p className="text-sm font-semibold text-[var(--success)]">
                Result: 7DE in base 16 equals 2014 in base 10.
              </p>
            </div>

            {/* Example 3 */}
            <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
              <h3 className="text-lg font-bold text-[var(--accent)]">
                Example C: Converting 1A3F to Decimal (4 Digits)
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-muted)]">
                Let us convert the four-digit hexadecimal string <span className="font-mono font-bold text-[var(--text)]">1A3F</span>:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base font-mono-numbers pl-2">
                <li>Position 3 (weight 16³ = 4,096): 1 × 4,096 = 4,096.</li>
                <li>Position 2 (weight 16² = 256): A (10) × 256 = 2,560.</li>
                <li>Position 1 (weight 16¹ = 16): 3 × 16 = 48.</li>
                <li>Position 0 (weight 16⁰ = 1): F (15) × 1 = 15.</li>
                <li>Sum all products: 4,096 + 2,560 + 48 + 15 = 6,719.</li>
              </ol>
              <p className="text-sm font-semibold text-[var(--success)]">
                Result: 1A3F in base 16 equals 6719 in base 10.
              </p>
            </div>
          </section>

          {/* Section 4: Common Mistakes to Avoid */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              4. Common Pitfalls and How to Avoid Them
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] text-sm space-y-1">
                <span className="font-bold text-[var(--danger)] block">
                  Mistake 1: Starting exponents from 1 instead of 0
                </span>
                <p className="text-[var(--text-muted)]">
                  The rightmost position always has an exponent of 0 (<span className="font-mono">16⁰ = 1</span>), not 1. Starting exponents at 1 multiplies your final answer by 16!
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] text-sm space-y-1">
                <span className="font-bold text-[var(--danger)] block">
                  Mistake 2: Confusing letter values (e.g. thinking A = 1)
                </span>
                <p className="text-[var(--text-muted)]">
                  Because 9 is the highest single numeric digit, the alphabet starts at 10. A is 10, B is 11, C is 12, D is 13, E is 14, and F is 15.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] text-sm space-y-1">
                <span className="font-bold text-[var(--danger)] block">
                  Mistake 3: Reading exponents from left to right
                </span>
                <p className="text-[var(--text-muted)]">
                  Powers increase from <em>right to left</em>. In a three-digit number, position 0 is on the far right, position 1 is in the middle, and position 2 is on the far left.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Real-World Use Cases */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              5. Where Hexadecimal is Used in Modern Computing
            </h2>
            <p>
              Hexadecimal is not just an abstract academic topic—it is foundational across almost every layer of software development and network infrastructure:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  Web & CSS Color Codes
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Web design specifies 24-bit RGB colors as six hex digits (<code className="font-mono">#RRGGBB</code>). For instance, <code className="font-mono">#FFFFFF</code> denotes maximum intensity of red, green, and blue (255, 255, 255 = White), while <code className="font-mono">#000000</code> is Black.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  Memory Addresses & Pointers
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Operating systems and debuggers (like GDB or LLDB) display memory pointers in hex (e.g. <code className="font-mono">0x7ffee4b2a890</code>). A 64-bit memory address takes 64 binary digits, but fits concisely in 16 hex characters.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Network MAC Addresses
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Every Ethernet and Wi-Fi interface has a unique 48-bit hardware MAC address partitioned into six pairs of hex octets, such as <code className="font-mono">00:1A:2B:3C:4D:5E</code>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Wireshark & Packet Inspection
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Network protocol analyzers like Wireshark render raw TCP/IP packet payloads in side-by-side hex dumps. Port numbers, flags, and checksums are verified directly through hex offsets.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2 md:col-span-2">
                <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  Unicode Code Points & Character Encoding
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  The universal character set maps symbols to hex code points formatted as <code className="font-mono">U+XXXX</code>. For example, the Latin letter &apos;A&apos; is <code className="font-mono">U+0041</code> (decimal 65), the Euro sign &apos;€&apos; is <code className="font-mono">U+20AC</code> (decimal 8,236), and the rocket emoji 🚀 is <code className="font-mono">U+1F680</code> (decimal 128,640).
                </p>
              </div>
            </div>
          </section>

          {/* Conclusion & Call to Action */}
          <section className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] space-y-3">
            <h2 className="text-xl font-bold text-[var(--text)]">
              Ready to Practice or Convert Instantly?
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)]">
              Use our interactive <Link href="/hex-to-decimal" className="text-[var(--accent)] font-semibold underline">Hex to Decimal Converter</Link> to test any value with live mathematical breakdown tables, or print out our comprehensive <Link href="/hex-to-decimal-chart" className="text-[var(--accent)] font-semibold underline">Hex to Decimal Reference Chart</Link>.
            </p>
          </section>
        </div>

        {/* FAQ Section */}
        <Faq items={guideFaqs} title="Frequently Asked Questions About Hex Conversion" />

        {/* Related Converters */}
        <RelatedConverters currentPath="/how-to-convert-hex-to-decimal" />
      </article>
    </>
  );
}
