import Link from "next/link";
import { siteConfig } from "@/config/site";
import { messages } from "@/messages/en";

const CONVERTER_LINKS = [
  { href: "/hex-to-decimal", label: messages.nav.hexToDec },
  { href: "/decimal-to-hex", label: messages.nav.decToHex },
  { href: "/binary-to-decimal", label: messages.nav.binToDec },
  { href: "/decimal-to-binary", label: messages.nav.decToBin },
  { href: "/hex-to-binary", label: messages.nav.hexToBin },
  { href: "/binary-to-hex", label: messages.nav.binToHex },
];

const RESOURCE_LINKS = [
  { href: "/hex-to-decimal-chart", label: messages.nav.chart },
  { href: "/how-to-convert-hex-to-decimal", label: messages.nav.guide },
  { href: "/about", label: messages.nav.about },
  { href: "/privacy", label: messages.nav.privacy },
  { href: "/contact", label: messages.nav.contact },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--surface)] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Privacy Column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-bold text-xl tracking-tight text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
              aria-label={`${siteConfig.name} Home`}
            >
              <svg
                className="w-6 h-6 text-[var(--accent)] shrink-0"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="2"
                  width="28"
                  height="28"
                  rx="8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  fill="var(--accent-light)"
                />
                <path
                  d="M10 10L22 22M22 10L10 22"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>
                Hex<span className="text-[var(--accent)]">Dec</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] max-w-sm">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--success)] font-medium bg-[var(--surface-raised)] border border-[var(--border)] rounded-full px-3 py-1 w-fit">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span>{messages.common.privacyNote}</span>
            </div>
          </div>

          {/* Converters Navigation */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
              Converters
            </h2>
            <ul className="space-y-2">
              {CONVERTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors inline-block py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Information */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] mb-3">
              Resources & Info
            </h2>
            <ul className="space-y-2">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors inline-block py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>
            © {currentYear} {siteConfig.name}. {messages.common.allRightsReserved}
          </p>
          <p>Instant BigInt math • 100% Client-Side • Zero Tracking</p>
        </div>
      </div>
    </footer>
  );
}
