import Link from "next/link";
import { messages } from "@/messages/en";

interface RelatedConvertersProps {
  currentPath: string;
}

const ALL_CONVERTERS = [
  {
    href: "/hex-to-decimal",
    title: "Hex to Decimal Converter",
    desc: "Convert base 16 hexadecimal strings into base 10 integers with step-by-step math.",
    badge: "16 → 10",
  },
  {
    href: "/decimal-to-hex",
    title: "Decimal to Hex Converter",
    desc: "Transform decimal numbers into hexadecimal notation with custom uppercase formatting.",
    badge: "10 → 16",
  },
  {
    href: "/binary-to-decimal",
    title: "Binary to Decimal Converter",
    desc: "Decode base 2 binary bits into decimal values with complete bit-weight powers.",
    badge: "2 → 10",
  },
  {
    href: "/decimal-to-binary",
    title: "Decimal to Binary Converter",
    desc: "Convert decimal integers into binary 4-bit nibbles with instant live preview.",
    badge: "10 → 2",
  },
  {
    href: "/hex-to-binary",
    title: "Hex to Binary Converter",
    desc: "Direct conversion between hexadecimal digits and 4-bit binary representations.",
    badge: "16 → 2",
  },
  {
    href: "/binary-to-hex",
    title: "Binary to Hex Converter",
    desc: "Group binary bits into nibbles and convert to compact hexadecimal codes.",
    badge: "2 → 16",
  },
  {
    href: "/hex-to-decimal-chart",
    title: "Hex to Decimal Chart (0-255)",
    desc: "Complete 1-byte lookup table mapping hex, decimal, binary, and ASCII values.",
    badge: "Table",
  },
  {
    href: "/how-to-convert-hex-to-decimal",
    title: "Hex Conversion Guide",
    desc: "In-depth tutorial explaining powers of 16, manual algorithms, and common use cases.",
    badge: "Guide",
  },
];

export function RelatedConverters({ currentPath }: RelatedConvertersProps) {
  // Filter out the current page
  const filtered = ALL_CONVERTERS.filter((c) => c.href !== currentPath).slice(0, 4);

  return (
    <section aria-labelledby="related-converters-heading" className="mt-16 w-full">
      <div className="mb-6">
        <h2
          id="related-converters-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]"
        >
          {messages.common.relatedTools}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Explore additional number base converters and mathematical lookup tables.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all hover:border-[var(--accent)] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-numbers text-xs font-bold text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-1 rounded-md">
                  {tool.badge}
                </span>
                <svg
                  className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="font-bold text-base text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
